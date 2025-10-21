import { useState,useEffect } from 'react';


function Report() {
  const [msg, setmsg] = useState("");
  const [emaill, setemaill] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const color = "blue";
  useEffect(() => {
    const userInfo =
      localStorage.getItem("user") !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : localStorage.clear();


    let email = userInfo[0]?.uid;
    setemaill(email)
  
    
  }, [])
  
  
  const sendmail = () => {
    
    
    let email = emaill;
    let message = msg;
    let data = {
      email,
      message
    }
    fetch('/api/report_mail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      // alert(res.status);
      
      if(res.status == 202){
        setShowAlert(true);
        setmsg("");
        
      }
      else if(res.status == 201){
        alert("not sent try again");
      }


      // if(res.status==202){
      //   setShowAlert(true);
      //   alert("success");
      // }
      // else if(res.status==201){
      //   alert("error");
      // }
    })
  }

  return (
    <>
      {showAlert ? <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Thank you for your response</strong>
        <span className="block sm:inline">We will sort it out soon</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => { setShowAlert(false) }}>
          <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
        </span>
      </div>:null}
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
            <img src="./mp4/title.gif"  alt="" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Report your problem</h2>
          
        </div>
        <form className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={emaill} disabled
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="Issue" className="sr-only">
                Issue
              </label>
              <textarea
              onChange={(e)=>{setmsg(e.target.value)}}
                id="Issue"
                name="Issue"
                type="Issue"
                autoComplete="current-Issue"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Issue"
              />
            </div>
          </div>

          

          <div>
              <button formAction="javascript:void(0);"
            onClick={sendmail}
              // type="submit"
              className="group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
              style={{ backgroundColor:"rgba(232 ,156, 7,0.9)"}}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {/* <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true" /> */}
              </span>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
     
    
    </>
  )
}

export default Report