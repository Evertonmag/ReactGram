const express = require("express");
const router = express.Router();

// Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
} = require("../controllers/photoController");

// Middlwares
const {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/ImageUpload");

// Routes
// Rota para adicionar uma imagem
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
// Rota para deletar uma imagem
router.delete("/:id", authGuard, deletePhoto);
//Rota para buscar todas as imagens
router.get("/", getAllPhotos);
//Rota para buscar todas as imagens de um usuário
router.get("/user/:id", authGuard, getUserPhotos);
//Rota para pesquisar imagens pelo titulo
router.get("/search", authGuard, searchPhotos);
//Rota para buscar a imagem pelo id dela
router.get("/:id", authGuard, getPhotoById);
//Rota para atualizar o titulo de uma foto
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
//Rota para dar like em um post
router.put("/like/:id", authGuard, likePhoto);
//Rota para inserir um cometário em uma foto
router.put(
  "/comment/:id",
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);

module.exports = router;
