const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Inserir a foto, com um usuario relacionado a ela
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Criar a foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user.id,
    userName: user.name,
  });

  // Verificar se a foto não for criada
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

// Remover a foto do BD
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
      return;
    }

    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Houve um erro, tente novamente mais tarde"] });

      return;
    }

    await Photo.findByIdAndDelete(photo._id);
    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluida com sucesso" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
  }
};

// Buscar todas as fotos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Buscar todas as fotos de um usuario pelo id do mesmo
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Buscar uma foto pelo id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(mongoose.Types.ObjectId(id));

  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  return res.status(200).json(photo);
};

// Atualizar a foto
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    // checar se a foto existe
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada"] });
    }

    // Checar se a foto é do usuário
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Houve um erro, tente novamente mais tarde"] });

      return;
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
  }
};

// Funcionalidade do Like
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Checar se a foto existe
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  // Checar se o usuario ja deu like (se sim tirar o like)
  let message = "";
  let IsLiked = false;

  if (photo.likes.includes(reqUser._id)) {
    // tirar o like do array de likes
    photo.likes.pop(reqUser._id);
    message = "A foto foi descurtida";
    IsLiked = false;
  } else {
    // Colocar o like no array de likes
    photo.likes.push(reqUser._id);
    message = "A foto foi curtida";
    IsLiked = true;
  }

  // Salvar as alterações
  photo.save();

  res.status(200).json({
    photoId: id,
    userId: reqUser._id,
    message: message,
    IsLiked: IsLiked,
  });
};

// Funcionalidade de Comentário
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  // Checar se a foto existe
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  // Atualizar o commentario no array de comentários
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);

  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: "O comentário foi adicionado com sucesso",
  });
};

// Busca de imagens pelo titúlo
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
