

// import { useRouter } from "next/router";



function imagee(s) {
    const change_image = document.getElementById("food-image");

    const foodImages = {
        "Manchuria": "manchuria.JPG",
        "Biryani": "biryani.jpg",
        "Noodles": "noodles.jpg",
        "Egg Rice": "egg rice.jpg"
    };

    if (foodImages[s]) {
        change_image.src = `./images/${foodImages[s]}`;
    }
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