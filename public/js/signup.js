$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const nameInput = $("input#name-input");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const cityInput = $("input#city-input");
  const technologyInput = $("input#technology-input");
  const githubInput = $("input#github-input");
  const linkedinInput = $("input#linkedin-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", (event) => {
    event.preventDefault();
    const userData = {
      name: nameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      city: cityInput.val().trim(),
      technology: technologyInput.val().trim(),
      github: githubInput.val().trim(),
      linkedin: linkedinInput.val().trim(),
    };

    if (
      (!userData.name ||
        !userData.email ||
        !userData.password ||
        !userData.city ||
        !userData.technology ||
        !userData.github,
      !userData.linkedin)
    ) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(
      userData.name,
      userData.email,
      userData.password,
      userData.city,
      userData.technology,
      userData.github,
      userData.linkedin
    );
    nameInput.val("");
    emailInput.val("");
    passwordInput.val("");
    cityInput.val("");
    technologyInput.val("");
    githubInput.val("");
    linkedinInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(
    name,
    email,
    password,
    city,
    technology,
    github,
    linkedin
  ) {
    $.post("/api/signup", {
      name: name,
      email: email,
      password: password,
      city: city,
      technology: technology,
      github: github,
      linkedin: linkedin,
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      // eslint-disable-next-line no-use-before-define
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
