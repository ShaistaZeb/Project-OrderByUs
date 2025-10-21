

// import { useRouter } from "next/router";


function imagee(s) {
    let change_image=document.getElementById("food-image");
    change_image.src=`./images/${s}.jpg`;
}

function returnImage(s) {
    let change_image=document.getElementById("food-image");
    change_image.src=`./images/${s}`;
}
const signout = () => {
    localStorage.clear();
    location.href = "/home"
    console.clear();
};
const active = ()=>{
    // alert("h")
    
    const accessToken =
        localStorage.getItem("accessToken") !== "undefined"
            ? JSON.parse(localStorage.getItem("accessToken"))
            : localStorage.clear();
    if (accessToken){
        location.href = "/activeOrders"
    }
    else{
        alert("login to get into orders page");
    }
}