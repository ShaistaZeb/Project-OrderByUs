
import  user  from "../images/h.png" ;
import Image from 'next/image';
function Loader() {
  return (
    <div >
          <div >
              <Image
                  src={user}
                  width="1000vh"
                  height="1000vh"
                  alt="user"
              >

              </Image>
          </div>
    </div>
  )
}

export default Loader