const express = require("express");
const router = express.Router();

// Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../controllers/UserController");

// Middlwares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/ImageUpload");

// Routes
// Rota para registrar um usuário
router.post("/register", userCreateValidation(), validate, register);
// Rota para Logar o usuário no sistema
router.post("/login", loginValidation(), validate, login);
// Rota para buscar o usuario logado atualmente
router.get("/profile", authGuard, validate, getCurrentUser);
// Rota para atualizar dados do usuario
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);
// Rota para buscar um usuario pelo id
router.get("/:id", getUserById);

module.exports = router;
