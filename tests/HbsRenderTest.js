var hb = require('express-handlebars').create();

const participantsList =  [{name: "Adam"}, {name: "Ewa"}];

// const renderPromise = hb.render("./views/error.hbs",{message:"Title", error: {"status":"Body", "stack": "Adam"}});
// const renderPromise = hb.render("./views/lottery.hbs",{message:"Title", participantsList:participantsList});
const renderPromise = hb.render("./views/mailTemplate.hbs",{participantName: "Adam", recipient: "Ewa"});

renderPromise
    .then((redered) => {
        console.log(redered);
        
    })
    //.catch((err) => console.error(err));

async function renderAwaitTest(){
    const renderPromise = hb.render("./views/mailTemplate.hbs",{participantName: "Adam", recipient: "Ewa"});
    let rendered =  await renderPromise;
    console.log("await rendered: ", rendered);
      
}

renderAwaitTest();
