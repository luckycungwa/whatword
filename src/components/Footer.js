import React, { useState } from "react";
import {
  Input,
  Button,
  Spacer,
  Divider,
  Image,
  Spinner,
} from "@nextui-org/react";
import { IoMailOutline } from "react-icons/io5";
import {
  FaFacebookSquare,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebase from "../services/firebase"; // Ensure your firebase initialization is here

import { ToastContainer, Slide } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [value, setValue] = useState(""); // email input
  const [isLoading, setIsLoading] = useState(false);

  // validate email using regular expression
  const validateEmail = (value) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  const successNotification = () =>
    toast.success("Subscription Successful", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!validateEmail(value)) {
      alert("Please enter a valid email address");
      setValue("");
      setIsLoading(false);
      return;
    }

    try {
      const db = getFirestore(firebase);
      await addDoc(collection(db, "subscribers"), {
        email: value,
        verified: false, //user must confirm email before we send notifications
        date: new Date(),
      });
      console.log("subscribed");
      successNotification();
      setValue("");
    } catch (e) {
      console.error("Error adding email: ", e);
      alert("Error adding email, please try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Spinner
          color="default"
          className="w-full h-full mb-50 transition-all"
        />
      )}
      
      <footer className="relative w-full bg-gray-100 pt-6 px-auto flex mb-0 mt-4">
        <div className="flex-row-reverse w-full mx-auto sm:mx-6 md:mx-10 justify-between">
          <div className="w-full md:flex md:flex-row justify-between items-flex-start px-4 ">
            <div className="flex flex-col px-4 mb-8 w-auto justify-start items-center">
              <h2 className="text-small font-normal mb-2 text-center">
                Connect with us
              </h2>
              {/* social media buttons icon only */}
              <div gap={1} className="flex row gap-2 ">
                <Button
                  isIconOnly
                  aria-label="Facebook"
                  color="none"
                  className="text-black-900 w-8 h-8"
                >
                  <FaFacebookSquare size={24} />
                </Button>
                <Button
                  isIconOnly
                  aria-label="Twitter"
                  color="none"
                  className="text-black-900 w-8 h-8"
                >
                  <FaTwitter size={24} />
                </Button>
                <Button
                  isIconOnly
                  aria-label="Instagram"
                  color="none"
                  className="text-black-900 w-8 h-8"
                >
                  <FaInstagram size={24} className="text-black-900" />
                </Button>
              </div>
            </div>
            {/* Middle Sign up Section */}
            <div className="flex-col sm:mt-0 px-4 grow">
              <div className="flex-col text-left sm:text-center">
                <h2 className="text-small font-semibold ">
                  
                  Signup For Notifications!
                </h2>
                <p className="text-xs mb-4">
                  Learn a new word every day & improve your vocab!
                </p>
              </div>
              <div>
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full flex-wrap gap-6"
                >
                  <div className="flex-wrap center xs:flex-col xl:flex-col lg:flex-col sm:flex-row row gap-4 w-full items-center flex align-center">
                    <Input
                      value={value}
                      type="email"
                      label="Email"
                      size="sm"
                      variant="bordered"
                      endContent={
                        <IoMailOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0 " />
                      }
                      onValueChange={setValue}
                      className="flex items-center w-full lg:w-1/2 sm:w-full md:min-w-4/1 xs:w-full justify-start"
                    />
                    <Button
                      type="submit"
                      className="black h-12 w-full sm:w-auto md:w-full lg:w-1/2 xl:w-1/2 2xl:w-100 sm:min-w-2/3 sm:px-8"
                    >
                      Subscribe
                    </Button>
                  </div>
                </form>

                <ToastContainer
                  position="top-center"
                  autoClose={4000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  transition={Slide}
                />
              </div>
            </div>

            <div className="w-60 md:w-auto md:ml-auto text-center">
              <Image
                src="./white-logo.png"
                alt="Whatword Logo"
                width={140}
                height={140}
                fallbackSrc="https://via.placeholder.com/600x600"
                className="hidden md:block mx-auto h-auto scale-75 bg-black p-4"
              />
            </div>
          </div>

          <Spacer y={6} />
          <Divider />
          <Spacer y={2} />
          <p className="text-sm text-center items-center text-gray-500 mb-4 mt-2">
            &copy; {new Date().getFullYear()} Lucky Cungwa - All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
