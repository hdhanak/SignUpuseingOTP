import { connect } from "mongoose";

function connects(){
    return connect('mongodb://localhost:27017/signUpWithOTP')
    .then(()=>
    console.log('conenction successfully done')
    ).catch((e)=>console.log(e)
    )
}
const Agenda = require('agenda');
const dbURL = 'mongodb://127.0.0.1:27017/AgendasignUpWithOTP';

const agenda = new Agenda({
    db: {address: dbURL, collection: 'otpverifies'},
    processEvery: '2 seconds',
    useUnifiedTopology: true
});

export {agenda}
export default connects