import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoApp.css";

const API = "http://localhost:5000/api/todos";

function TodoApp() {
  const [list, setList] = useState([]);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [edit, setEdit] = useState(null);
  const [p, setP] = useState("");
  const [q, setQ] = useState("");
  const [load, setLoad] = useState(true);

  useEffect(() => {
    axios
      .get(API)
      .then(function (res) {
        setList(res.data);
        setLoad(false);
      })
      .catch(function () {
        alert("error");
        setLoad(false);
      });
  }, []);

  function add() {
    if (x == "") {
      alert("enter");
      return;
    }
    axios.post(API, { title: x, description: y }).then(function (res) {
      var arr = [res.data];
      for (var i = 0; i < list.length; i++) {
        arr.push(list[i]);
      }
      setList(arr);
      setX("");
      setY("");
    });
  }

  function del(id) {
    if (confirm("sure?") == false) return;
    axios.delete(API + "/" + id).then(function () {
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i]._id != id) {
          arr.push(list[i]);
        }
      }
      setList(arr);
    });
  }

  function check(item) {
    var obj = {};
    obj.title = item.title;
    obj.description = item.description;
    obj.completed = !item.completed;

    axios.put(API + "/" + item._id, obj).then(function (res) {
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i]._id == item._id) {
          arr.push(res.data);
        } else {
          arr.push(list[i]);
        }
      }
      setList(arr);
    });
  }

  function save() {
    if (p == "") return;
    axios
      .put(API + "/" + edit, { title: p, description: q })
      .then(function (res) {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
          if (list[i]._id == edit) {
            arr.push(res.data);
          } else {
            arr.push(list[i]);
          }
        }
        setList(arr);
        setEdit(null);
      });
  }

  var count = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].completed == true) {
      count++;
    }
  }

  if (load) return <div className="load">wait...</div>;

  return (
    <div className="wrap">
      <h1>todo</h1>

      <div className="form">
        <input
          value={x}
          onChange={function (e) {
            setX(e.target.value);
          }}
          placeholder="title"
        />
        <input
          value={y}
          onChange={function (e) {
            setY(e.target.value);
          }}
          placeholder="desc"
        />
        <button onClick={add}>add</button>
      </div>

      <div className="stats">
        <span>all: {list.length}</span>
        <span>done: {count}</span>
        <span>left: {list.length - count}</span>
      </div>

      <div>
        {list.map(function (item) {
          if (edit == item._id) {
            return (
              <div key={item._id} className="item">
                <input
                  value={p}
                  onChange={function (e) {
                    setP(e.target.value);
                  }}
                />
                <input
                  value={q}
                  onChange={function (e) {
                    setQ(e.target.value);
                  }}
                />
                <button onClick={save}>save</button>
                <button
                  onClick={function () {
                    setEdit(null);
                  }}
                >
                  no
                </button>
              </div>
            );
          } else {
            return (
              <div key={item._id} className="item">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={function () {
                    check(item);
                  }}
                />
                <span
                  style={{
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.title}
                </span>
                {item.description && <span>({item.description})</span>}
                <button
                  onClick={function () {
                    setEdit(item._id);
                    setP(item.title);
                    setQ(item.description || "");
                  }}
                >
                  edit
                </button>
                <button
                  onClick={function () {
                    del(item._id);
                  }}
                >
                  del
                </button>
              </div>
            );
          }
        })}
      </div>

      {list.length == 0 && <p className="empty">empty</p>}
    </div>
  );
}

export default TodoApp;
