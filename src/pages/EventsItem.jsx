import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { MdLocationOn } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { GiTrophy } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";

import { getEvent, addUserToEvent } from "../store/slices/eventSlice";
import { getMembers, addEventToMember } from "../store/slices/usersSlice";

import { CustomButton } from "../components/elements";
import EventMember from "../components/events/EventMember";

import "../styles/event-item.scss";

const EventsItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.usersSlice.members);
  const { membersList } = currentEvent;

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );
  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );

  const {
    eventName,
    eventDate,
    eventDescription,
    eventPlace,
    cityName,
    points,
  } = currentEvent;

  useEffect(() => {
    dispatch(getEvent(id));
  }, [id]);

  useEffect(() => {
    dispatch(getMembers());
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };
  const createList = (uid) => {
    dispatch(
      addEventToMember({
        uid,
        eid: id,
        isPresent: false,
        comment: "",
        additionalPoints: 0,
      })
    );
    dispatch(
      addUserToEvent({
        uid: uid,
        eid: id,
      })
    );
  };

  return (
    <>
      <section className="eventItem">
        <Container>
          <CustomButton onClick={goBack} arrow>
            <HiArrowLeft size="30px" />
          </CustomButton>
          <div className="eventItem__inner">
            <h2 className="eventItem__title">{eventName}</h2>
            {eventDescription && (
              <p className="eventItem__desc">{eventDescription}</p>
            )}
            <div className="eventItem__info">
              <div className="eventItem__item">
                <span className="eventItem__icon">
                  <MdLocationOn size="36px" />
                </span>
                {eventPlace === "city" ? (
                  <h4 className="eventItem__text">{cityName}</h4>
                ) : (
                  <div className="eventItem__text">{eventPlace}</div>
                )}
              </div>

              <div className="eventItem__item">
                <span className="eventItem__icon">
                  <GiTrophy size="36px" />
                </span>
                <span className="eventItem__text">{points}</span>
              </div>

              <div className="eventItem__item">
                <span className="eventItem__icon">
                  <GoCalendar size="36px" />
                </span>
                <span className="eventItem__text">{eventDate}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="eventMembers">
        <Container>
          <ul>
            {eventMembers?.map((member) => (
              <EventMember key={member.id} member={member} />
            ))}
          </ul>
        </Container>
      </section>

      <section className="members">
        <Container>
          <ul className="members__list">
            {otherMembers?.map((member) => (
              <li className="members__item" key={member.id}>
                <div className="members__info">
                  <div className="members__img-container">
                    <img
                      className="members__img"
                      src={member.image}
                      alt={member.fullName}
                    />
                  </div>
                  <h4 className="members__name">{member.fullName}</h4>
                </div>
                <button onClick={() => createList(member.id)}>Add</button>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
};

export default EventsItem;
