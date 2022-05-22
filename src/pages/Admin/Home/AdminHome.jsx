import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../component/CardComponent/Card";

import { Context as createContext } from "../../../ContextApi/createContext";

function AdminHome() {
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

  const [report, setReport] = useState([
    {
      approved: 0,
      notApproved: 0,
      booked: 0,
      post: 0,
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
      const needAprovalHouse = response.data.houseDetails.filter(
        (item) => item.adminApproval === false
      );
      const approvedHouse = response.data.houseDetails.filter(
        (item) => item.adminApproval === true
      );

      const bookedHouse = response.data.houseDetails.filter(
        (item) => item.adminApproval === true
      );

      setReport({
        ...report,
        approved: approvedHouse.length,
        notApproved: needAprovalHouse.length,
        post: response.data.houseDetails.length,
        booked: bookedHouse.length,
      });
    } catch (error) {
      //console.error({ error });
    }
  };

  //Owner remove the house Details
  const approveHouseDetail = async (id, approvalStatus) => {
    try {
      const response = await axios.post(
        "/owner/house/approveHouseDetail",
        JSON.stringify({ houseID: id, adminApproval: approvalStatus }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        fetchHouseDetails();
        navigate("/admin/home");
      }
      alert(
        response.data.message === true
          ? "Successfully house Approved"
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
            .filter((item) => item.adminApproval === false)
            .map((item) => {
              //console.log("data : " + JSON.stringify(item));
              return (
                <Card
                  house={item}
                  user={user}
                  removeHouseDetail={approveHouseDetail}
                />
              );
            })}

          {houseDetails
            .filter((item) => item.adminApproval === true)
            .map((item) => {
              //console.log("data : " + JSON.stringify(item));
              return (
                <Card
                  house={item}
                  user={user}
                  removeHouseDetail={approveHouseDetail}
                />
              );
            })}
        </HeaderContainer>

        <AuthContainer>
          <LabelName>BOOKING REPORT</LabelName>
          <div>
            <LabelName>Admin Approved House:</LabelName>
            <LabelName>{report.approved}</LabelName>
          </div>
          <div>
            <LabelName>Admin approval pending House:</LabelName>
            <LabelName>{report.notApproved}</LabelName>
          </div>
          <div>
            <LabelName>Booked House:</LabelName>
            <LabelName>{report.booked}</LabelName>
          </div>
          <div>
            <LabelName>Number Of House:</LabelName>
            <LabelName>{report.post}</LabelName>
          </div>
        </AuthContainer>
      </AddDetailsContainer>
    </HeaderContainer>
  );
}

export default AdminHome;

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
  border: 1px dotted greenyellow;
  justify-content: center;
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
