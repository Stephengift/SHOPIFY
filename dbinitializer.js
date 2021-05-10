const mongoose = require("mongoose");
const Image = require("./models/image");

mongoose.connect("mongodb://localhost/imagesdb",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async() => {
    await Image.deleteMany({});
    for(let i=0; i<3;i++){
        const image = new Image({ 
            owner: "60971915b3db5463882ec0d1",
            title: 'CADILLAC ESCALADE',
            image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/2020-cadillac-escalade-001-1567021710.jpg?crop=0.681xw:0.604xh;0.218xw,0.396xh&resize=1200:*',
            description: 'The new Cadillac 2021 leather car',
            price : 20000,
        })
        await image.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});