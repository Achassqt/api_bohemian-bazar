exports.loginErrors = (err) => {
  let errors = { pseudo: "", password: "" };
  if (err.message.includes("pseudo")) errors.pseudo = "Pseudo incorrect";

  if (err.message.includes("password"))
    errors.password = "Mot de passe invalide";

  return errors;
};
