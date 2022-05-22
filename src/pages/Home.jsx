import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Context as createContext } from "../ContextApi/createContext";
import { useNavigate } from "react-router-dom";

function Home() {
  //Navigation
  const navigate = useNavigate();

  //Access Global state
  const { state, addLoginUser, clearUser } = useContext(createContext);
  const { user } = state;

  const { register, handleSubmit } = useForm();
  const [data, setData] = useState({ email: "", password: "", role: "" });

  const [users, setUsers] = useState([{}]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const responseUserDetails = await axios.get("user/getAllUsers");
      ////console.log(responseUserDetails.data);
      setUsers(responseUserDetails.data);
    };
    clearUser();
    fetchAllUsers();
  }, [0]);

  ///
  const loginForm = async () => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };
      //console.log(JSON.stringify(userData));

      const response = await axios.post(
        "user/login",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //Before clearing the existing global state of an user.
      //console.log("clear the global user");
      clearUser();
      //console.log(user);

      //console.log("response from server: " + JSON.stringify(response.data));

      //add user to global state
      addLoginUser(response.data.user);

      //console.log(user.user);

      if (response.data.user.role !== null) {
        if (response.data.user.role === "Admin") {
          navigate("/admin/home");
        } else if (response.data.user.role == "Owner") {
          navigate("/owner/addDetails");
        } else {
          navigate("/tenant/home");
        }
      }
    } catch (exception) {
      //console.log(`Erorr Occured ${exception}`);
    }
  };

  return (
    <HomeContainer>
      <HeaderContainer></HeaderContainer>
      <AuthForm onSubmit={handleSubmit(loginForm)}>
        <AuthContainer>
          <ShadowContainer>
            <div>
              <Label>
                <LabelName>Email</LabelName>
                <input
                  {...register("email", { required: true, maxLength: 20 })}
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Password</LabelName>
                <input
                  {...register("password", { required: true, maxLength: 20 })}
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  type="password"
                />
              </Label>
            </div>
            <div>
              <Label>
                {/* <LoginDetail>LOGIn AS</LoginDetail> */}
                <LabelName>{}</LabelName>
              </Label>
            </div>

            <SubmitContainer>
              <button name="submit" type="submit">
                submit
              </button>

              <button
                name="reset"
                onClick={() => {
                  navigate("/createUser");
                }}
              >
                {" "}
                Create User
              </button>
            </SubmitContainer>
          </ShadowContainer>
        </AuthContainer>
      </AuthForm>
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
`;

const HeaderContainer = styled.div`
  flex-direction: row;
  background-color: #ecf0f3;
`;

const AuthForm = styled.form``;

const AuthContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
`;

const LabelName = styled.span`
  margin-right: 10px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ShadowContainer = styled.div`
  border: 2px solid #ecf0f3;
  border-radius: 10%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 20px;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const LoginDetail = styled.label`
  font-size: 12;
`;
