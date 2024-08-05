import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./erros";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { signup } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const Signup = () => {
  const [erros, setErros] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((data) => ({ ...data, [name]: files ? files[0] : value }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signup, formData);

  const { fetchUser } = UrlState();

  useEffect(() => {
    console.log(data);

    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [error, loading]);

  const handleSignup = async () => {
    setErros([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      //api call
      await fnSignup();
    } catch (error) {
      console.error(error);
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErros(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Input
            name="name"
            placeholder="Enter Name"
            type="text"
            onChange={handleInputChange}
          />
          {erros.name && <Error message={erros.name} />}
        </div>
        <div className="space-y-2">
          <Input
            name="email"
            placeholder="Enter Email"
            type="email"
            onChange={handleInputChange}
          />
          {erros.email && <Error message={erros.email} />}
        </div>
        <div className="space-y-2">
          <Input
            name="password"
            placeholder="Enter Password"
            type="password"
            onChange={handleInputChange}
          />
          {erros.password && <Error message={erros.password} />}
        </div>
        <div className="space-y-2">
          <Input
            name="profile_pic"
            accept="image/*"
            type="file"
            onChange={handleInputChange}
          />
          {erros.profile_pic && <Error message={erros.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
