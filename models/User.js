const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    require: true,
    minlenght: 3,
    maxlenght: 20,
    trim: true,
  },

  password: {
    type: String,
    require: true,
    minlenght: 6,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (pseudo, password) {
  const user = await this.findOne({ pseudo });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("password incorrect");
  }
  throw Error("email incorrect");
};

module.exports = mongoose.model("User", userSchema);
