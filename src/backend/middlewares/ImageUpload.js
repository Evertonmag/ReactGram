const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },

  filename: (req, file, cb) => {
    //todo: implementar um sistema unico para nomear arquivos
    //como um id único e evitar sobreposições de imagens
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  //imageStorage => seta a pasta para salvar e nomeia o arquivo
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, selecione uma imagem .png ou .jpg"));
    }

    cb(undefined, true);
  },
});

module.exports = { imageUpload };
