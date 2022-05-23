import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

import "./CardsStyle.css";

function Card({ house, user, removeHouseDetail, updateRequest }) {
  const requestUpdate = (id) => {
    house.requestUserDetails.forEach((item) => {
      if (item.userId === id) item.ownerApproval = true;
    });
    ////console.log(house);

    //Find index of specific object using findIndex method.

    // const objIndex = house.requestUserDetails.findIndex(
    //   (item) => item.userId === id
    // );
    // console.log(objIndex);
    // //Log object to Console.
    // console.log("Before update: ", house.requestUserDetails[objIndex]);

    // //Update object's ownerApproval property.
    // house.requestUserDetails[objIndex].ownerApproval = true;

    house.houseBookedStatus = true;
    console.log("Aproved House" + JSON.stringify(house));
    updateRequest(house._id, house);
  };

  //const [disable, setDisable] = useState(house.houseBookedStatus);

  return (
    <MainContainer>
      <CardWrapper>
        <CardConatiner>
          <Cards>
            <SmallCard>
              <Titles>Locality:</Titles>
              <Values>{house.locality}</Values>
            </SmallCard>
            <SmallCard>
              <Titles>City:</Titles>
              <Values>{house.city}</Values>
            </SmallCard>
          </Cards>
          <Border></Border>
          <Cards>
            <SmallCard>
              <Titles>Sq.Feet:</Titles>
              <Values>{house.squareFeet}</Values>
            </SmallCard>
            <SmallCard>
              <Titles>Price:</Titles>
              <Values>Rs. {house.price} /month</Values>
            </SmallCard>
          </Cards>
          <Border></Border>
          <Cards>
            <SmallCard>
              <Titles>Type:</Titles>
              <Values>{house.type}</Values>
            </SmallCard>
            <SmallCard>
              <Titles>Admin Approval:</Titles>
              <Values>{house.adminApproval ? "Yes" : "No"}</Values>
            </SmallCard>
          </Cards>
          <Border></Border>
          <Cards>
            <SmallCard>
              <Titles>House Booked:</Titles>
              <Values>{house.houseBookedStatus ? "Yes" : "No"}</Values>
            </SmallCard>
          </Cards>
        </CardConatiner>
        {"Owner" === user.role && (
          <PeopleContainer>
            <label>Tenant Request</label>
            <RequestLabel
              onClick={() => {
                alert("View Details");
              }}
            >
              {house.requestUserDetails.length}
            </RequestLabel>
          </PeopleContainer>
        )}

        <ButtonContainer>
          <Cards>
            <button
              onClick={() => {
                if ("Owner" === user.role) {
                  if (house.houseBookedStatus === false)
                    removeHouseDetail(house._id);
                  else alert("Can't remove House Booked");
                } else if ("Admin" === user.role) {
                  if (house.houseBookedStatus === false)
                    removeHouseDetail(house._id, !house.adminApproval);
                  else alert("Can't remove House Booked");
                } else {
                  const userData = {
                    userId: user.userId,
                    name: user.name,
                    mobileNumber: user.mobileNumber,
                    email: user.email,
                  };

                  if (
                    house.requestUserDetails.filter(
                      (item) => item.userId === user.userId
                    ).length > 0
                  ) {
                    const removedBooking = house.requestUserDetails.filter(
                      (item) =>
                        item.userId !== undefined && item.userId !== user.userId
                    );
                    if (removedBooking.length === 0)
                      house.requestUserDetails = [];
                    else {
                      house.requestUserDetails.push(...removedBooking);
                    }
                  } else {
                    house.requestUserDetails.push(
                      ...house.requestUserDetails,
                      userData
                    );
                  }

                  removeHouseDetail(house._id, house.requestUserDetails);
                }
              }}
            >
              {"Owner" === user.role || "Tenanet" === user.role
                ? "Owner" === user.role
                  ? "Remove"
                  : house.requestUserDetails.filter(
                      (item) => item.userId === user.userId
                    ).length > 0
                  ? "Cancel Booking"
                  : "Book House"
                : house.adminApproval == false
                ? "Approval"
                : "Remove Approval"}
            </button>
          </Cards>
        </ButtonContainer>
      </CardWrapper>
      <UserContainer>
        {"Owner" === user.role &&
          house.requestUserDetails.length > 0 &&
          house.requestUserDetails.map((item) => {
            return (
              <UserContainerV>
                <label>
                  <Values>Name: </Values>
                  {item.name}
                </label>
                <label>
                  <Values>M.NO: </Values>
                  {item.mobileNumber}
                </label>
                <label>
                  <Values>Email: </Values>
                  {item.email}
                </label>
                <button
                  onClick={() => requestUpdate(item.userId)}
                  disabled={house.houseBookedStatus}
                >
                  Approve
                </button>
              </UserContainerV>
            );
          })}
      </UserContainer>
    </MainContainer>
  );
}

export default Card;

const CardWrapper = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: row;
  border: 1px solid #ecf0f3;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 0px 0px 0px;
  justify-content: space-around;
  //border: 1px solid green;
`;

const SmallCard = styled.div`
  justify-content: space-between;
  align-items: center;
`;

const CardConatiner = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: row;
  border: 1px solid #ecf0f3;
  padding: 10px;
  justify-content: flex-start;
`;

const MainContainer = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: column;
  border: 1px solid #ecf0f3;
  padding: 10px;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: column;
  padding: 10px;
  justify-content: flex-start;
`;

const UserContainerV = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: column;
  border: 1px solid #ecf0f3;
  width: 20%;
  padding: 10px;
  justify-content: flex-start;
`;

const ButtonContainer = styled.div``;

const PeopleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const RequestLabel = styled.label`
  margin: 10px 0px;
  padding: 10px;
  border: 1px solid #ecf0f3;
`;

const Border = styled.label`
  border: 2px dotted #d5dadf;
  margin: 0px 10px;
`;

const Titles = styled.label`
  font-size: 10;
  font-weight: 900;
  margin: 0px 5px 5px 0px;
`;

const Values = styled.span`
  font-size: 10;
  text-transform: capitalize;
`;
