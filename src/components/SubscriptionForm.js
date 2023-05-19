import { useState, useRef } from "react";
import { toast } from 'react-toastify';

export default function SubscriptionForm() {
  let [email, setEmail] = useState("");
  let [alertClass, setAlertClass] = useState("");

  const abortController = new AbortController();
  const timeoutDuration = 1000;

  var parentComp = useRef();

  setTimeout(() => {
    abortController.abort();
  }, timeoutDuration);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate(email)) {
      setAlertClass("alert-validate");
      return;
    }

    fetch("http://103.108.146.90:5000/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      signal: abortController.signal,
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          throw new Error("Request failed");
        }
      })
      .then((data) => JSON.parse(`${data}`))
      .then((data) => {
        console.log(data);
        toast.success('success');
      })
      .catch((error) => {
        console.log("Error: ", error);
        toast.error('error');
      });

    setAlertClass("");
  };

  const validate = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)){
      return true;
    }else{
      return false;
    }
  };

  return (
    <form
      className="w-full flex-w flex-c-m validate-form"
      onSubmit={handleSubmit}
    >
      <div
        ref={parentComp}
        className={"wrap-input100 validate-input where1 " + alertClass}
        data-validate="Valid email is required: user@email.domain"
      >
        <input
          className="input100 placeholder0 s2-txt2"
          type="text"
          name="email"
          placeholder="Enter Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="focus-input100"></span>
      </div>

      <button className="flex-c-m size3 s2-txt3 how-btn1 trans-04 where1">
        Subscribe
      </button>
    </form>
  );
}
