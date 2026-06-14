from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from src.db.database import get_db
from src.middlewares.auth import validate_owner_token
from src.middlewares.rate_limit import check_rate
from src.models.box import Box
from src.models.feedback import Feedback
from src.schemas.box import BoxFeedbacksResponse
from src.schemas.box import FeedbackOut as BoxFeedbackOut
from src.schemas.box import ReplyOut as BoxReplyOut
from src.schemas.feedback import FeedbackCreate, FeedbackOut
from src.schemas.reply import ReplyCreate, ReplyOut
from src.services.feedback_service import create_feedback
from src.services.reply_service import create_reply
from logger_config import logger

_db_dependency = Depends(get_db)

router = APIRouter()


@router.post(
    "/box/{uuid}/feedback",
    response_model=FeedbackOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_feedback(
    uuid: str,
    feedback_in: FeedbackIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Получен анонимный отзыв для ящика {uuid} с IP: {request.client.host}")

    try:
        box = await get_box_by_uuid(db, uuid)
        if not box:
            logger.warning(
                f"WARNING: Попытка отправить отзыв в несуществующий ящик: {uuid}"
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Box not found"
            )

        new_feedback = await create_new_feedback(db, box.id, feedback_in.text)

        logger.info(f"Отзыв для ящика {uuid} успешно сохранен в базу данных PostgreSQL")
        return new_feedback

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        logger.exception(
            f"CRITICAL: Непредвиденная ошибка СУБД при сохранении отзыва для ящика {uuid}!"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )


@router.get("/box/{uuid}", response_model=BoxFeedbacksResponse)
def get_feedbacks(
    uuid: str,
    token: str = Query(None),
    x_owner_token: str = Header(None, alias="X-Owner-Token"),
    db: Session = _db_dependency,
):
    box = db.query(Box).filter(Box.uuid == uuid).first()
    if box is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Box not found"
        )

    provided_token = token or x_owner_token
    validate_owner_token(provided_token, box)

    feedbacks = []
    for fb in box.feedbacks:
        replies = [
            BoxReplyOut(
                id=reply.id, text=reply.text, created_at=reply.created_at.isoformat()
            )
            for reply in fb.replies
        ]
        feedbacks.append(
            BoxFeedbackOut(
                id=fb.id,
                text=fb.text,
                status=fb.status,
                moderation_notes=fb.moderation_notes,
                created_at=fb.created_at.isoformat(),
                replies=replies,
            )
        )

    return BoxFeedbacksResponse(uuid=box.uuid, feedbacks=feedbacks)


@router.post(
    "/feedback/{id}/reply", response_model=ReplyOut, status_code=status.HTTP_200_OK
)
def reply(
    id: int,
    request: Request,
    reply_data: ReplyCreate,
    token: str = Query(None),
    x_owner_token: str = Header(None, alias="X-Owner-Token"),
    db: Session = _db_dependency,
):
    check_rate(request.client.host, "POST:/feedback/{id}/reply")
    feedback = db.query(Feedback).filter(Feedback.id == id).first()
    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found"
        )

    box = db.query(Box).filter(Box.id == feedback.box_id).first()
    if box is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Box not found"
        )

    provided_token = token or x_owner_token
    validate_owner_token(provided_token, box)

    created = create_reply(db, feedback.id, reply_data.text)
    return ReplyOut(
        id=created.id, text=created.text, created_at=created.created_at.isoformat()
    )
