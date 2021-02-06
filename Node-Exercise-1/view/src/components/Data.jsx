import React from "react";

const Data = ({ data, Delete, update }) => {
  return (
    <tr className="table-margin">
      <td>
        <input
          className="input-data"
          disabled
          readOnly={true}
          value={data.firstName}
        />
      </td>
      <td>
        <input
          className="input-data"
          disabled
          readOnly={true}
          value={data.secondName}
        />
      </td>
      <td>
        <button
          className="btn-succes"
          type="button"
          onClick={() => update(data._id)}
        >
          Edit
        </button>
      </td>
      <td>
        <button
          className="btn-danger"
          onClick={() => Delete(data._id)}
          type="button"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Data;
