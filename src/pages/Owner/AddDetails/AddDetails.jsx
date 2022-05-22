import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../component/CardComponent/Card";

import { Context as createContext } from "../../../ContextApi/createContext";

const houseType = [
  {
    label: "1BHK",
    value: "1BHK",
  },
  {
    label: "2BHK",
    value: "2BHK",
  },
  {
    label: "3BHK",
    value: "3BHK",
  },
];

function AddDetails() {
  const navigate = useNavigate();

  //Access Global state
  const { state } = useContext(createContext);
  const { user } = state;

  const { register, handleSubmit } = useForm();
  const [details, setDetails] = useState({
    type: "1BHK",
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

  useEffect(() => {
    fetchHouseDetails();
    if (user === undefined || user.userId === undefined) navigate("/");
  }, [0]);

  //Fetch User post house Details
  const fetchHouseDetails = async () => {
    try {
      const response = await axios.post(
        "/owner/house/getDetails",
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
    } catch (error) {
      //console.error({ error });
    }
  };

  //Owner post the house details
  const houseDetailsForm = async () => {
    try {
      const houseDetails = {
        type: details.type,
        price: details.price,
        city: details.city,
        locality: details.locality,
        squareFeet: details.squareFeet,
        adminApproval: details.adminApproval,
        requestUserDetails: details.requestUserDetails,
        houseBookedStatus: details.status,
        userId: details.userId,
      };
      //console.log(JSON.stringify(houseDetails));

      const response = await axios.post(
        "/owner/house/addHouseDetails",
        JSON.stringify(houseDetails),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        fetchHouseDetails();
        navigate("/owner/addDetails");
      }
      //console.log(response.data);
    } catch (exception) {
      //console.error(`Erorr Occured ${exception}`);
    }
  };

  //Owner remove the house Details
  const removeHouseDetail = async (id) => {
    try {
      const response = await axios.post(
        "/owner/house/removeHouseDetail",
        JSON.stringify({ houseID: id }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        fetchHouseDetails();
        navigate("/owner/addDetails");
      }
      alert(
        response.data.message === true
          ? "Successfully house detail removed! "
          : "Failed to remove house detail! "
      );
    } catch (error) {
      //console.error(error);
    }
  };

  //Update userDetails
  const updateHouseRequest = async (id, house) => {
    try {
      //console.log("update :: " + JSON.stringify(house));
      const response = await axios.post(
        "/owner/house/updateHouseRequest",
        JSON.stringify({ houseID: id, house: house }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        fetchHouseDetails();
        navigate("/owner/addDetails");
      }
      alert(
        response.data.message === true
          ? "Approved Tenanet Request "
          : "Failed to Approve "
      );
    } catch (error) {
      //console.error(error);
    }
  };

  return (
    <AddDetailsContainer>
      <LogoutConatiner>
        <button onClick={() => navigate("/")}>Logout</button>
      </LogoutConatiner>
      <HeaderContainer>
        {houseDetails.map((item) => {
          //console.log("data : " + JSON.stringify(item));
          return (
            <Card
              house={item}
              user={user}
              removeHouseDetail={removeHouseDetail}
              updateRequest={updateHouseRequest}
            />
          );
        })}
      </HeaderContainer>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(houseDetailsForm)}>
          <ShadowContainer>
            <div>
              <Label>
                <LabelName>Type</LabelName>
                <RoleSelector
                  name="type"
                  value={details.type}
                  onChange={(e) =>
                    setDetails({ ...details, type: e.target.value })
                  }
                >
                  {houseType.map((option) => (
                    <Option
                      key={option.label.toString()}
                      label={option.label}
                      value={option.value}
                    >
                      {option.label}
                    </Option>
                  ))}
                </RoleSelector>
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Price</LabelName>
                <input
                  {...register("price", { required: true, maxLength: 20 })}
                  value={details.price}
                  onChange={(e) =>
                    setDetails({ ...details, price: e.target.value })
                  }
                  type="number"
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>City</LabelName>
                <input
                  {...register("city", { required: true, maxLength: 20 })}
                  value={details.city}
                  onChange={(e) =>
                    setDetails({ ...details, city: e.target.value })
                  }
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Locality</LabelName>
                <input
                  {...register("locality", { required: true, maxLength: 20 })}
                  value={details.locality}
                  onChange={(e) =>
                    setDetails({ ...details, locality: e.target.value })
                  }
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Square Feet</LabelName>
                <input
                  {...register("squareFeet", { required: true, maxLength: 20 })}
                  value={details.squareFeet}
                  onChange={(e) =>
                    setDetails({ ...details, squareFeet: e.target.value })
                  }
                  type="number"
                />
              </Label>
            </div>

            <SubmitContainer>
              <button name="submit" type="submit">
                submit
              </button>
              <button name="reset"> reset</button>
            </SubmitContainer>
          </ShadowContainer>
        </AuthForm>
      </AuthContainer>
    </AddDetailsContainer>
  );
}

export default AddDetails;

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

const AuthForm = styled.form``;

const AuthContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ShadowContainer = styled.div`
  border: 2px solid #ecf0f3;
  border-radius: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  height: 50vh;
`;

const LabelName = styled.span`
  margin-right: 20px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

const LogoutConatiner = styled.div`
  display: flex;
  flex-direction: row;
`;
