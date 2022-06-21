import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { MdLocationOn } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { GiTrophy } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";

import { CustomButton } from "../elements";

const EventDescription = () => {
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const {
    eventName,
    eventDate,
    eventDescription,
    eventPlace,
    cityName,
    points,
  } = currentEvent;
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <section className="eventItem">
      <Container fluid="xl">
        <CustomButton onClick={goBack} version="arrow">
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
  );
};

export default EventDescription;
