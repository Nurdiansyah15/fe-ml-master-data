import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../contexts/PageContext";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import HeroForm from "./components/HeroForm"; // Ganti dengan HeroForm
import { useNavigate } from "react-router-dom";
import {
  createHero,
  deleteHero,
  getAllHeroes,
  updateHero,
} from "../../redux/thunks/heroThunk";
import { clearHero } from "../../redux/features/heroSlice";

export default function Heroes() {
  const { updatePage } = useContext(PageContext);
  const { heroes } = useSelector((state) => state.hero); // Ganti dengan state hero
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // Menentukan mode edit atau create
  const [heroToEdit, setHeroToEdit] = useState(null); // Menyimpan data hero yang akan diedit

  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Modal konfirmasi
  const [dataToDelete, setDataToDelete] = useState(null);

  useEffect(() => {
    updatePage(
      "Heroes Master Data",
      <>
        <Button
          onClick={() => {
            setHeroToEdit(null); // Reset hero yang diedit
            setEditMode(false); // Pastikan mode create
            setModalOpen(true); // Buka modal
          }}
          color="primary"
        >
          Create
        </Button>
      </>
    );
  }, [updatePage]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllHeroes())
      .unwrap()
      .finally(() => setLoading(false));

    return () => {
      dispatch(clearHero());
    };
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    setLoading(true);

    const action =
      editMode && heroToEdit
        ? updateHero({ heroID: heroToEdit.id, ...data }) // Ganti dengan updateHero
        : createHero(data); // Ganti dengan createHero

    dispatch(action)
      .unwrap()
      .then(() => {
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (heroData) => {
    const hero = {
      id: heroData.hero_id,
      name: heroData.name,
      image: heroData.image,
    };
    setHeroToEdit(hero); // Simpan data hero yang ingin diedit
    setEditMode(true); // Ubah ke mode edit
    setModalOpen(true); // Buka modal untuk mengedit hero
  };

  const openConfirmModal = (data) => {
    setDataToDelete(data);
    setConfirmModalOpen(true);
  };

  const handleDeleteData = () => {
    console.log("dataToDelete:", dataToDelete);
    if (dataToDelete) {
      dispatch(deleteHero(dataToDelete.hero_id))
        .unwrap()
        .catch(console.error)
        .finally(() => {
          setConfirmModalOpen(false);
          setDataToDelete(null);
          setLoading(false);
        });
    }
  };

  if (loading)
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="text-white flex flex-col justify-start h-full w-full">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {heroes.map(
          (
            hero // Ganti dengan heroes
          ) => (
            <div
              key={hero.hero_id}
              className="relative bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image and Name */}
              <img
                src={hero.image}
                alt={hero.name}
                className="w-36 h-36 object-cover rounded-full"
              />
              <h3 className="text-md font-semibold mt-1 text-center">
                {hero.name}
              </h3>

              {/* Detail Button */}
              {/* <Button
                onPress={() => {
                  nav("/heroes/" + hero.hero_id); // Ganti dengan hero
                }}
                color="primary"
                className="mt-2 w-full text-sm"
              >
                Detail
              </Button> */}

              {/* Hover Edit/Delete Button */}
              <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity">
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <Button isIconOnly size="sm" className="bg-gray-600">
                      <Ellipsis size={16} color="white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    color="white"
                    className="bg-gray-700 border border-gray-500"
                  >
                    <div className="p-2 flex flex-col gap-2">
                      {/* Edit Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          color="warning"
                          size="sm"
                          className="text-white"
                          onClick={() => handleEdit(hero)} // Aktifkan edit mode
                        >
                          Edit
                        </Button>
                      </div>

                      {/* Delete Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => openConfirmModal(hero)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>
            {editMode ? "Edit Hero" : "Create New Hero"}{" "}
            {/* Ganti dengan Hero */}
          </ModalHeader>
          <ModalBody>
            <HeroForm onSubmit={handleFormSubmit} heroData={heroToEdit} />{" "}
            {/* Ganti dengan HeroForm */}
            {/* Kirim data hero jika edit */}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <ModalContent className="bg-gray-800 text-white">
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this hero?</p>
            <p className="text-red-500">
              This action will{" "}
              <span className="font-bold">delete all data related</span> to this
              hero.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteData}>
              Delete
            </Button>
            <Button color="default" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
