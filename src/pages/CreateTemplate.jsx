import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { ClockLoader, PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplate from "../hooks/useTemplate";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        imgURL: null,
    });

    const [imageAsset, setImageAsset] = useState({
        isImageLoading: false,
        uri: null,
        progress: 0,
    });

    // state to store selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    // get templates data
    const {
        data: templates,
        isLoading: templatesIsLoading,
        isError: templatesIsError,
        refetch: templatesRefetch,
    } = useTemplate();

    // get user data
    const { data: user, isLoading } = useUser();

    // function to handle input title of the template
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevRec) => ({ ...prevRec, [name]: value }));
    };

    // function to handle image upload
    const handleFileSelect = async (e) => {
        // show loader while image is being uploaded
        setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));

        // get the file from the input
        const file = e.target.files[0];

        if (file && isFileAllowed(file)) {
            // create a reference where file will be stored
            const storageRef = ref(
                storage,
                `Templates/${Date.now()}-${file.name}`
            );

            // upload file to storage
            const uploadTask = uploadBytesResumable(storageRef, file);

            // listen for state changes, errors, and completion of the upload
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    setImageAsset((prevAsset) => ({
                        ...prevAsset,
                        progress:
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100,
                    }));
                },
                (error) => {
                    // handle error if any here
                    if (error.message.includes("storage/unauthorized")) {
                        toast.error("Error: Authorization revoked");
                    } else {
                        toast.error(`Error: ${error.message}`);
                    }
                },
                () => {
                    // get the download url if the upload is successful
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageAsset((prevAsset) => ({
                                ...prevAsset,
                                uri: downloadURL,
                            }));
                        }
                    );

                    toast.success("File uploaded successfully");
                    setInterval(() => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            isImageLoading: false,
                        }));
                    }, 2000);
                }
            );
        } else {
            toast.info("File type not allowed");
        }
    };

    // function to check whether file type is allowed or not
    const isFileAllowed = (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    // function to delete image from storage
    const deleteAnImageObject = async () => {
        // delete image from the local state before deleting it from storage
        setInterval(() => {
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                progress: 0,
                uri: null,
            }));
        }, 800);

        // reference of the image to be deleted
        const deleteRef = ref(storage, imageAsset.uri);

        // delete image from storage
        deleteObject(deleteRef).then(() => {
            toast.success("Image deleted successfully");
        });
    };

    // function to push selected tags to the selectedTags state
    const handleSelectedTags = (tag) => {
        // check if the tag is selected or not
        if (selectedTags.includes(tag)) {
            // if selected already then remove it
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            // if not selected then add it
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // function to push the template data to the cloud
    const pushToCloud = async () => {
        const timestamp = serverTimestamp();
        const id = `${Date.now()}`;

        const _doc = {
            _id: id,
            title: formData.title,
            imgURL: imageAsset.uri,
            tags: selectedTags,
            name:
                templates && templates.length > 0
                    ? `Template${templates.length + 1}`
                    : "Template1",
            timestamp: timestamp,
        };

        await setDoc(doc(db, "templates", id), _doc)
            .then(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    title: "",
                    imageURL: "",
                }));
                setImageAsset((prevAsset) => ({
                    ...prevAsset,
                    progress: 0,
                    uri: null,
                }));
                setSelectedTags([]);
                templatesRefetch();
                toast.success("Template created successfully");
            })
            .catch((err) => {
                console.log(`Error: ${err.message}`);
            });
    };

    // function to remove the added template data from the cloud
    const removeTemplate = async (template) => {
        // first delete the image from the storage
        const deleteRef = ref(storage, template?.imgURL);
        await deleteObject(deleteRef).then(async () => {
            await deleteDoc(doc(db, "templates", template?._id))
                .then(() => {
                    toast.success(
                        "Template deleted successfully from the cloud"
                    );
                    templatesRefetch();
                })
                .catch((err) => {
                    toast.error(`Error: ${err.message}`);
                });
        });
    };

    // check if the user is an admin or not and redirect to home page if not
    useEffect(() => {
        if (!isLoading && !adminIds.includes(user?.uid)) {
            navigate("/", { replace: true });
        }
    }, [user, isLoading]);

    return (
        <div className="w-full px-6 xs:px-5 sm:px-12 md:px-20  2xl:px-32 py-4 grid grid-cols-1 xs:grid-cols-12">
            {/* Left container */}
            <div className="col-span-12 xs:col-span-4 sm:col-span-4 lg:col-span-4 w-full flex-1 flex flex-col items-center justify-start gap-4 px-4 2xl:px-8">
                <div className="w-full">
                    <p className="text-sm text-txtPrimary">
                        Create a new template
                    </p>
                </div>

                {/* Temp ID Section*/}
                <div className="w-full flex items-center justify-end flex-wrap">
                    <p className="text-sm text-txtLight uppercase font-semibold whitespace-nowrap">
                        tempID :{" "}
                    </p>
                    <p className="text-xs text-txtDark capitalize font-bold">
                        {templates && templates.length > 0
                            ? `Template${templates.length + 1}`
                            : "Template1"}
                    </p>
                </div>

                {/* Template Title */}
                <input
                    className="w-full px-4 py-2 text-sm rounded-md bg-transparent border border-gray-300 text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
                    type="text"
                    placeholder="Template Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />

                {/* File Upload field*/}
                <div className="w-full bg-gray-100 rounded-md border-2 border-dotted border-gray-300 backdrop-blur-md h-[320px] xs:h-[150px] sm:h-[250px] lg:h-[300px] 2xl:h-[300px] 2xl:w-64 lg:w-64 cursor-pointer flex items-center justify-center">
                    {imageAsset.isImageLoading ? (
                        // Image is being uploaded show loader
                        <React.Fragment>
                            <div className="flex flex-col justify-center items-center gap-3">
                                <PuffLoader color="#498FCD" size={30} />
                                <p>{imageAsset?.progress.toFixed(2)}%</p>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {!imageAsset?.uri ? (
                                // Show upload file section
                                <React.Fragment>
                                    <label className="w-full cursor-pointer h-full">
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                                                <FaUpload className="text-sm md:text-2xl" />
                                                <p className="text-xs md:text-sm text-txtLight whitespace-nowrap">
                                                    Click to upload
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            className="w-0 h-0"
                                            accept=".jpeg,.jpg,.png"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                </React.Fragment>
                            ) : (
                                // Show image preview after file is uploaded
                                <React.Fragment>
                                    <div className="relative w-full h-full overflow-hidden rounded-md">
                                        <img
                                            src={imageAsset?.uri}
                                            className="w-full h-full object-cover"
                                            alt="resume-template"
                                            loading="lazy"
                                        />

                                        {/* Delete Template */}
                                        <div
                                            onClick={deleteAnImageObject}
                                            className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                                        >
                                            <FaTrash className="text-sm text-white" />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>

                {/* Tags Section */}
                <div className="w-full flex items-center flex-wrap gap-2">
                    {initialTags.map((tag, i) => (
                        <div
                            className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                                selectedTags.includes(tag)
                                    ? "bg-blue-500 text-white"
                                    : ""
                            }`}
                            key={i}
                            onClick={() => handleSelectedTags(tag)}
                        >
                            <p className="text-[10px] sm:text-xs">{tag}</p>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="button"
                    className="w-full bg-blue-700 text-white rounded-md py-3"
                    onClick={pushToCloud}
                >
                    Save
                </button>
            </div>

            {/* Right Container */}
            <div className="col-span-12 xs:col-span-8 sm:col-span-8 lg:col-span-8   px-2 w-full flex-1 py-4">
                {templatesIsLoading ? (
                    <React.Fragment>
                        {/* Loading animation before templates are fetched */}
                        <div className="w-full h-full flex items-center justify-center">
                            <ClockLoader color="#498FCD" size={60} />
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {/* Templates List */}
                        {templates && templates.length > 0 ? (
                            <React.Fragment>
                                <div className="w-full h-full grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2  gap-4">
                                    {templates?.map((template) => (
                                        <div
                                            key={template._id}
                                            className="w-full h-[300px] xs:h-[450px] 
                                            sm:h-[500px] md:h-[300px] lg:h-[450px] 2xl:h-[500px] rounded-md overflow-hidden cursor-pointer relative"
                                        >
                                            <img
                                                src={template?.imgURL}
                                                alt=""
                                                className="w-full h-full object-cover relative"
                                            />
                                            {/* Delete Template */}
                                            <div
                                                onClick={() =>
                                                    removeTemplate(template)
                                                }
                                                className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                                            >
                                                <FaTrash className="text-sm text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-xl tracking-wider capitalize text-txtPrimary">
                                        No Templates Available
                                    </p>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default CreateTemplate;
