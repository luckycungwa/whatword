import React from "react";
import { Input, Button, Spacer, Link, Divider } from "@nextui-org/react";
import { IoMailOutline } from "react-icons/io5";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const [value, setValue] = React.useState("");

  // validate email using regular expression
  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateEmail(value) ? false : true;
  }, [value]);
  const handleSubmit = () => {
    // check if user email is valid if not send alert and change input color to red
    if (!validateEmail(value)) {
      alert("Please enter a valid email address");
      setValue("");
      return;
    } else {
      alert("Thank you for subscribing!");
      setValue("");
    }
  };

  return (
    <footer className="bg-gray-100 py-8 flex mb-0 bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4">
            <h2 className="text-lg font-semibold mb-4">Connect with us</h2>
            {/* social media buttons icon only */}
            <div gap={1} className="flex row gap-2">
            <Button isIconOnly aria-label="Facebook">
              <FaFacebookSquare size={24} />
            </Button>
            <Button isIconOnly aria-label="Twitter">
              <FaTwitter size={24} />
            </Button>
            <Button isIconOnly aria-label="Instagram">
              <FaInstagram size={24} />
            </Button>
              
            </div>
          </div>
          <div className="w-full md:w-2/3 px-4 py-8 md:pt-0">
            <h2 className="text-lg font-semibold">Signup for our newsletter</h2>
            <p className="text-sm mb-6">
              Learn a new word every day amd improve your vocab!
            </p>
            <form onSubmit={handleSubmit} className="row flex flex-wrap gap-2 ">
              <div className="flex row gap-4 w-full md:w-1/2 items-center">
                <Input
                  value={value}
                  type="email"
                  label="Email"
                  size="sm"
                  variant="bordered"
                  //   isInvalid={isInvalid}
                  endContent={
                    <IoMailOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mb-1.5" />
                  }
                  color={isInvalid ? "error" : ""}
                  errorMessage={isInvalid && "Please enter a valid email"}
                  onValueChange={setValue}
                  className="max-w-xs items-center"
                />
                {/* checki f user email is valid when button is clicked & make input red if not*/}
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </div>
        </div>
        <Spacer y={2} />
        <Divider />
        <Spacer y={2} />
        <p className="text-sm text-center items-center text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Whatword? - All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
