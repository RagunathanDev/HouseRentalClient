import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../component/CardComponent/Card";

import { Context as createContext } from "../../ContextApi/createContext";

function TenantHome() {
  const navigate = useNavigate();

  //Access Global state
  const { state } = useContext(createContext);
  const { user } = state;

  const { register, handleSubmit } = useForm();
  const [details, setDetails] = useState({
    type: "select",
    price: "",
    city: "",
    locality: "",
    squareFeet: "",
    adminApproval: false,
    requestUserDetails: [],
    status: false,
    userId: user.userId,
  });

  const [houseDetails, setHouseDetails] = useState([]);

  const [bookedHouse, setBookedHouse] = useState([]);

  const [report, setReport] = useState([
    {
      approved: 0,
      notApproved: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHouseDetails();
    if (user === undefined || user.userId === undefined) navigate("/");
  }, [0]);

  //Fetch User post house Details
  const fetchHouseDetails = async () => {
    try {
      const response = await axios.post(
        "/owner/house/getHouseDetails",
        JSON.stringify({ userId: user.userId }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("House Deatils");
      //console.log(response.data.houseDetails);
      setHouseDetails(response.data.houseDetails);

      if (response.data.houseDetails.requestUserDetails.length() > 0) {
        const needAprovalHouse =
          response.data.houseDetails.requestUserDetails.filter(
            (item) => item.userId === user.userId
          );
        const approvedHouse =
          response.data.houseDetails.requestUserDetails.filter(
            (item) => item.userId === user.userId
          );
        setReport({
          ...report,
          approved: approvedHouse.length,
          notApproved: needAprovalHouse.length,
        });

        // //House Booked by User
        // const houseBookedByUser = response.data.houseDetails.requestUserDetails.filter((item))
      }
    } catch (error) {
      //console.error({ error });
    }
  };

  //Owner remove the house Details
  const bookHouseDetail = async (id, requestUserDetails) => {
    try {
      //console.log(requestUserDetails);

      const response = await axios.post(
        "/owner/house/bookingHouse",
        JSON.stringify({ houseID: id, requestUserDetails: requestUserDetails }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        fetchHouseDetails();
        navigate("/tenant/home");
      }
      alert(
        response.data.message === true
          ? "House Bokked Successfully"
          : "Failed to Approve house"
      );
    } catch (error) {
      //console.error(error);
    }
  };

  return (
    <HeaderContainer>
      <LogoutConatiner>
        <button onClick={() => navigate("/")}>Logout</button>
      </LogoutConatiner>
      <AddDetailsContainer>
        <HeaderContainer>
          {houseDetails
            .filter(
              (item) =>
                item.adminApproval === true && item.houseBookedStatus === false
            )
            .map((item) => {
              return (
                <Card
                  house={item}
                  user={user}
                  removeHouseDetail={bookHouseDetail}
                />
              );
            })}
        </HeaderContainer>

        <AuthContainer>
          <LabelName>Your Booking History</LabelName>
          <div>
            <LabelName>Booked House:</LabelName>

            <LabelName>{report.approved}</LabelName>
          </div>
        </AuthContainer>
      </AddDetailsContainer>
    </HeaderContainer>
  );
}

export default TenantHome;

const AddDetailsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: row;
`;

const HeaderContainer = styled.div`
  width: 75%;
  //background-color: red;
  margin: 10px;
`;

const LogoutConatiner = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AuthContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const LabelName = styled.span`
  margin-right: 20px;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const RoleSelector = styled.select`
  width: 55%;
`;

const Option = styled.option`
  width: 50 px;
`;
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2px;
  grid-row-gap: 2px;
  background-color: black;
`;
