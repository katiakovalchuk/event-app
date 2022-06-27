import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { MdLocationOn } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { GiTrophy, GiDiamondTrophy } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";
import { CgTrophy } from "react-icons/cg";

import { getNewEvent } from "../store/slices/eventSlice";
import { getUserEventsList } from "../store/slices/userSlice";
import { capitalizeFirstLet } from "../helpers/string";

import { CustomButton } from "../components/elements";
import Spinner from "../components/Spinner";

const UserEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userId = useSelector((state) => state.userSlice.user.email);
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const { eventsList, status } = useSelector((state) => state.userSlice);

  const userEvent = eventsList.find((event) => event.id === id);
  const {
    eventName,
    eventDate,
    eventDescription,
    eventPlace,
    cityName,
    points,
  } = currentEvent;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getNewEvent(id));
  }, [id]);

  useEffect(() => {
    dispatch(getUserEventsList(userId));
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      {status === "loading" && <Spinner />}
      <section className="eventItem eventUser">
        <Container fluid="xl">
          <CustomButton onClick={goBack} className="arrow">
            <HiArrowLeft size="30px" />
          </CustomButton>
          <div className="eventItem__inner">
            <h2 className="eventItem__title">{eventName}</h2>
            {eventDescription && (
              <p className="eventItem__desc">
                {capitalizeFirstLet(eventDescription)}
              </p>
            )}
            <div className="eventItem__info">
              <div className="eventItem__item">
                <span className="eventItem__icon">
                  <MdLocationOn size="36px" />
                </span>
                {eventPlace === "city" ? (
                  <h4 className="eventItem__text">
                    {capitalizeFirstLet(cityName)}
                  </h4>
                ) : (
                  <p className="eventItem__text">{eventPlace}</p>
                )}
              </div>

              <div className="eventItem__item">
                <span className="eventItem__icon">
                  <GoCalendar size="36px" />
                </span>
                <span className="eventItem__text">{eventDate}</span>
              </div>
            </div>
            <div className="eventItem__mark">
              <div className="eventItem__scores">
                <GiDiamondTrophy size="40px" />
                {userEvent?.additionalPoints ? (
                  <span className="eventItem__total">
                    {points + userEvent?.additionalPoints}
                  </span>
                ) : (
                  <span className="eventItem__total">{points}</span>
                )}
              </div>
              <p className="eventItem__helperText">Total score</p>
            </div>
            {userEvent?.additionalPoints && (
              <div className="eventItem__points">
                <div className="eventItem__mark">
                  <div className="eventItem__item">
                    <span className="eventItem__icon">
                      <GiTrophy size="36px" />
                    </span>
                    <span className="eventItem__text">{points}</span>
                  </div>
                  <p className="eventItem__helperText">Event score</p>
                </div>
                <div className="eventItem__mark">
                  <div className="eventItem__item">
                    <span className="eventItem__icon">
                      <CgTrophy size="24px" />
                    </span>
                    <span className="eventItem__text">
                      {userEvent.additionalPoints}
                    </span>
                  </div>
                  <p className="eventItem__helperText">Additional score</p>
                </div>
              </div>
            )}
            {userEvent?.comment && (
              <div className="eventItem__comment">
                {capitalizeFirstLet(userEvent?.comment)}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};

export default UserEvent;
