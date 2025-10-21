import React from 'react'
import styles from "../design/mail.module.css";
import { useState } from 'react';

function Mail() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault()
        
        let data = {
            name,
            email,
            message
        }
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => {
            
            if (res.status === 200) {
                
                setSubmitted(true)
                setName('')
                setEmail('')
                setBody('')
            }
        })
    }
    
  return (
      <div className={styles.container}>
          < form className={styles.main} >
              < formGroup className={styles.inputGroup} >
                  < label htmlFor='name'>Name</label>
                  < input style={{ "border": "1px solid black" }} type='text' onChange={(e) => { setName(e.target.value) }} name='name' className={styles.inputField} />
              </formGroup>
              < formGroup className={styles.inputGroup} >
                  < label htmlFor='email'>Email</label>
                  < input style={{ "border": "1px solid black" }} type='email' name='email' onChange={(e) => { setEmail(e.target.value) }} className={styles.inputField} />
              </formGroup>
              < formGroup className={styles.inputGroup} >
                  < label htmlFor='message'>Message</label>
                  < input style={{ "border": "1px solid black" }} type='text' name='message' onChange={(e) => { setMessage(e.target.value) }} className={styles.inputField} />
              </formGroup>
              < input type='submit' style={{"border":"1px solid black"}} onClick={(e) => { handleSubmit(e) }} />
          </form >
      </div>
  )
}

export default Mail