import { Button, Empty, Input, message, Modal, Spin, Form } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const MockApi = () => {
  interface IComment {
    id: string;
    name: string;
    avatar: string;
    title: string;
    comment: string;
    createdAt: string;
    view_count: number;
  }
  interface IForm {
    title: string;
    author: string;
    comment: string;
  }
  interface IPut {
    title: string;
    comment: string;
    name: string;
  }

  const [data, setData] = useState<IComment[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching data
  const [submitting, setSubmitting] = useState<boolean>(false); // Loading state for submitting form
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<IComment | null>(null); // Track the selected comment
  const [modalForm] = Form.useForm();

  const showModal = (comment: IComment) => {
    setSelectedComment(comment); // Set the selected comment when opening the modal
    setModalOpen(true);

    modalForm.setFieldsValue({
      title: comment.title,
      name: comment.name,
      comment: comment.comment,
    });
  };

  // const hideModal = () => {
  //   setModalOpen(false);
  // };

  const cancelModal = () => {
    setModalOpen(false);
  };

  const getData = async () => {
    setLoading(true); // Start loading while fetching data
    try {
      const res = await axios.get(
        "https://680de135c47cb8074d91713f.mockapi.io/comments"
      );
      if (res?.data) {
        setData(res?.data.reverse());
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load data.");
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };
  // console.log(data);

  // Edit data

  const editData = async (id: string | undefined, values: IPut) => {
    if (!id) return;
    setLoading(true); // Start loading while editing data
    try {
      const res = await axios.put(
        `https://680de135c47cb8074d91713f.mockapi.io/comments/${id}`,
        {
          title: values.title,
          comment: values.comment,
          name: values.name,
        }
      );
      console.log(res);
      getData(); // Re-fetch data after edit
    } catch (error) {
      console.log(error);
      message.error("Failed to edit comment.");
    } finally {
      setLoading(false); // Stop loading after the edit is done
    }
  };

  // Delete data
  const deleteData = async (id: string) => {
    setLoading(true); // Start loading while deleting data
    try {
      const res = await axios.delete(
        `https://680de135c47cb8074d91713f.mockapi.io/comments/${id}`
      );
      console.log(res);
      getData(); // Re-fetch data after delete
    } catch (error) {
      console.log(error);
      message.error("Failed to delete comment.");
    } finally {
      setLoading(false); // Stop loading after the delete is done
    }
  };

  useEffect(() => {
    getData(); // Fetch data on initial load
  }, []);

  console.log(data);

  const postData = async (author: string, comment: string, title: string) => {
    setSubmitting(true); // Start loading while posting data
    try {
      const res = await axios.post(
        "https://680de135c47cb8074d91713f.mockapi.io/comments",
        {
          name: author,
          comment,
          title,
        }
      );
      console.log(res);
      getData(); // Re-fetch data after post
    } catch (error) {
      console.log(error);
      message.error("Failed to post comment.");
    } finally {
      setSubmitting(false); // Stop loading after the post is done
    }
  };

  const onFinish = (values: IForm) => {
    message.success("Form submitted successfully");
    console.log("Form values:", values);
    postData(values.author, values.comment, values.title);
  };

  const ModalFinish = (values: IPut) => {
    console.log(values);
    editData(selectedComment?.id, values);
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Comments</h1>

      {/* Form */}
      <Form onFinish={onFinish}>
        <Form.Item label="Author" name="author">
          <Input />
        </Form.Item>
        <Form.Item label="Comment" name="comment">
          <Input />
        </Form.Item>
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      {/* Loading Spinner for Data */}
      {loading ? (
        <Spin tip="Loading comments..." />
      ) : (
        <div className="grid grid-cols-3 gap-10">
          {data ? (
            data.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{comment.name}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {comment.title}
                </h3>
                <p className="text-gray-700 mt-2">{comment.comment}</p>
                <div className="flex gap-5 mt-5">
                  <Button
                    onClick={() => {
                      showModal(comment);
                    }}
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      deleteData(comment.id);
                    }}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    Delete
                  </Button>

                  <Modal
                    open={modalOpen}
                    onOk={() => {
                      modalForm.submit();
                    }}
                    onCancel={cancelModal}
                    title="Edit Blog"
                  >
                    {/* Show comment details in the modal */}
                    {selectedComment && (
                      <div>
                        <Form onFinish={ModalFinish} form={modalForm}>
                          <Form.Item label="Title" name="title">
                            <Input placeholder={selectedComment.title}></Input>
                          </Form.Item>
                          <Form.Item label="Author" name="name">
                            <Input placeholder={selectedComment.name}></Input>
                          </Form.Item>
                          <Form.Item label="Comment" name="comment">
                            <Input
                              placeholder={selectedComment.comment}
                            ></Input>
                          </Form.Item>
                        </Form>
                      </div>
                    )}
                  </Modal>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  );
};

export default MockApi;
