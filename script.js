const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const strengthIndicator = document.querySelector(".strength-indicator");
const confirmError = document.getElementById("confirmError");
const form = document.getElementById("registrationForm");

// Password requirements regex patterns
const requirements = {
  length: (str) => str.length >= 8,
  uppercase: (str) => /[A-Z]/.test(str),
  lowercase: (str) => /[a-z]/.test(str),
  number: (str) => /[0-9]/.test(str),
  special: (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str),
};

function checkPasswordStrength(password) {
  if (password.length === 0) return { strength: "", color: "#eee" };
  if (password.length < 6) return { strength: "Weak", color: "#e74c3c" };

  const hasLettersAndNumbers = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(password);
  if (password.length >= 6 && hasLettersAndNumbers) {
    if (Object.values(requirements).every((req) => req(password))) {
      return { strength: "Strong", color: "#2ecc71" };
    }
    return { strength: "Moderate", color: "#f1c40f" };
  }
  return { strength: "Weak", color: "#e74c3c" };
}

function updateRequirements(password) {
  for (const [req, checkFn] of Object.entries(requirements)) {
    const element = document.getElementById(req);
    if (checkFn(password)) {
      element.classList.add("met");
    } else {
      element.classList.remove("met");
    }
  }
}

password.addEventListener("input", (e) => {
  const { strength, color } = checkPasswordStrength(e.target.value);
  strengthIndicator.style.backgroundColor = color;
  strengthIndicator.style.width = strength ? "100%" : "0";
  updateRequirements(e.target.value);

  // Check confirm password match
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
});

function validateConfirmPassword() {
  if (password.value !== confirmPassword.value) {
    confirmError.textContent = "Passwords do not match";
    return false;
  } else {
    confirmError.textContent = "";
    return true;
  }
}

confirmPassword.addEventListener("input", validateConfirmPassword);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    validateConfirmPassword() &&
    checkPasswordStrength(password.value).strength === "Strong"
  ) {
    alert("Registration successful!");
    form.reset();
    strengthIndicator.style.backgroundColor = "#eee";
    strengthIndicator.style.width = "0";
    updateRequirements("");
  } else {
    alert(
      "Please ensure your password meets all requirements and passwords match.",
    );
  }
});
