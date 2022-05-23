import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const userRoles = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Owner",
    value: "Owner",
  },
  {
    label: "Tenanet",
    value: "Tenanet",
  },
];

function CreateUser() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    aadhaar: "",
    role: "Tenanet",
    password: "",
    confirmPassword: "",
  });

  const loginForm = async () => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        mobileNo: data.mobileNo,
        aadhaar: data.aadhaar,
        role: data.role,
        password: data.password,
      };
      //console.log(JSON.stringify(userData));

      if (!(data.password === data.confirmPassword)) {
        alert("Password Mismatch");
        return false;
      }

      const response = await axios.post(
        "user/createUser",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data !== null) {
        navigate("/");
      }
      //console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HomeContainer>
      {/* <HeaderContainer>
        <h1>Header</h1>
      </HeaderContainer> */}
      <AuthForm onSubmit={handleSubmit(loginForm)}>
        <AuthContainer>
          <ShadowContainer>
            <div>
              <Label>
                <LabelName>Name</LabelName>
                <input
                  {...register("name", { required: true, maxLength: 20 })}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Email</LabelName>
                <input
                  {...register("email", { required: true, maxLength: 20 })}
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  type="email"
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Mobile Number</LabelName>
                <input
                  {...register("mobileNo", { required: true, maxLength: 20 })}
                  value={data.mobileNo}
                  onChange={(e) =>
                    setData({ ...data, mobileNo: e.target.value })
                  }
                  type="number"
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Aadhaar</LabelName>
                <input
                  {...register("aadhaar", {
                    required: true,
                    minLength: 8,
                    maxLength: 20,
                  })}
                  value={data.aadhaar}
                  onChange={(e) =>
                    setData({ ...data, aadhaar: e.target.value })
                  }
                  type="number"
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Password</LabelName>
                <input
                  {...register("password", {
                    required: true,
                    minLength: 8,
                    maxLength: 20,
                  })}
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
                <LabelName>Confirm Password</LabelName>
                <input
                  {...register("confirmPassword", {
                    required: true,
                    minLength: 8,
                    maxLength: 20,
                  })}
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  type="password"
                />
              </Label>
            </div>
            <div>
              <Label>
                <LabelName>Role</LabelName>
                <RoleSelector
                  name="role"
                  value={data.role}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                >
                  {userRoles.map((option) => (
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
            <SubmitContainer>
              <button name="submit" type="submit">
                submit
              </button>
              {/* <button name="reset"> reset</button> */}
              <button
                name="reset"
                onClick={() => {
                  navigate("/");
                }}
              >
                Back
              </button>
            </SubmitContainer>
          </ShadowContainer>
        </AuthContainer>
      </AuthForm>
    </HomeContainer>
  );
}

export default CreateUser;

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
  margin-right: 20px;
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
  padding: 20px;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const RoleSelector = styled.select`
  width: 55%;
`;

const Option = styled.option`
  width: 50 px;
`;
