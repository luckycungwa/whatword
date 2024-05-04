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
  FaBell,
  FaFacebookSquare,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import firebase from "../services/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import SuccessModal from "./SuccessModal";

const Footer = () => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // validate email using regular expression
  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!validateEmail(value)) {
      alert("Please enter a valid email address");
      setValue("");
      setIsLoading(false);
      // return;
      console.log("email not valid");
    }
    try {
      const db = getFirestore(firebase); // Access Firestore
      await addDoc(collection(db, "users"), {
        // Add document to "users" collection
        email: value,
        timestamp: Date.now(),
      });
      setShowSuccessModal(true); // Show the SuccessModal if the email was stored successfully
      setValue("");
      alert("Email Saved Successfully");
      console.log("Email saved successfully");
      
    } catch (error) {
      console.error("Error saving email:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner color="default" className="w-full h-full mb-50 transition-all" />}
      <footer className="relative w-full bg-gray-100 pt-6 px-auto flex mb-0">
        {showSuccessModal && <SuccessModal />}

        <div className="flex-row-reverse w-full mx-auto sm:mx-6 md:mx-10 justify-between ">
          <div className="w-full md:flex md:flex-row justify-between items-flex-start px-4 ">
            <div className="flex flex-col px-4 mb-8 w-auto justify-start">
              <h2 className="text-ms font-normal mb-2">Connect with us</h2>
              {/* social media buttons icon only */}
              <div gap={1} className="flex row gap-1.5 ">
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
                <h2 className="text-lg font-semibold">
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
                  <div className="flex xs:flex-col xl:flex-col lg:flex-col sm:flex-row row gap-4 w-full items-center justify-center ">
                    <Input
                      value={value}
                      type="email"
                      label="Email"
                      // labelPlacement="top"
                      size="sm"
                      variant="bordered"
                      // icon
                      endContent={
                        <IoMailOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0 " />
                      }
                      // placeholder="Enter your email"
                      onValueChange={setValue}
                      className="flex items-center w-full lg:w-1/2 sm:w-full md:min-w-4/1 xs:w-full  justify-start"
                    />
                    {/* checki f user email is valid when button is clicked & make input red if not*/}
                    <Button
                      type="submit"
                      className="black w-1/2 sm:w-auto md:w-auto lg:w-1/2 xl:w-1/2 2xl:w-100 sm:min-w-2/3 sm:px-8 h-10"
                    >
                      <FaBell size={18} className="hidden " /> Subscribe
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-60 md:w-auto md:ml-auto text-center">
              <Image
                src="/assets/whatword_logo.png"
                alt="Whatword Logo"
                width={140}
                height={140}
                fallbackSrc="https://via.placeholder.com/600x600"
                className="hidden md:block mx-auto h-auto scale-75"
              />
            </div>
          </div>

          <Spacer y={6} />
          <Divider />
          <Spacer y={2} />
          <p className="text-sm text-center items-center text-gray-500 mb-4 mt-2">
            &copy; {new Date().getFullYear()} Whatword? - All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
