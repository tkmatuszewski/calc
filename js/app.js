import React, {Component} from "react";
import ReactDOM from "react-dom";
import Calendar from 'react-calendar';

class App extends Component {
    state = {
      users : []
    };
    getUsers = (users) => {
        this.setState({users : users })
    };
    render() {
        return (
            <>
                <Calendartoggle/>
                <Users/>
            </>
        )
    }
}

class Calendartoggle extends Component {
    state = {
        show: true
    };
    toggle = () => {
        this.setState({show: !this.state.show})
    };
    showCalendar = (e) => {
        e.preventDefault();
        this.toggle();
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <div>
                        <button onClick={this.showCalendar}> ></button>
                    </div>
                    <CalendarPart/>
                </>
            )
        } else {
            return (
                <div>
                    <button onClick={this.showCalendar}> ></button>
                </div>
            )
        }
    }
}

class CalendarPart extends Component {
    state = {
        date: new Date(),
    };
    onChange = date => this.setState({date});

    render() {
        return (
            <div className={"calendarPart"}>
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}/>
                <CalendarEvents head={this.state.date}/>
            </div>
        );
    }
}

class CalendarEvents extends Component {
    render() {
        return (
            <div className={"calendarEvents"}>
                <CalendarDate date={this.props.head}/>
                <AddEvent/>
                <CalendarEventList/>
            </div>
        )
    }
}

class CalendarDate extends Component {
    state = {
        date: "",
    };
    formatDate = () => {
        const day = this.props.date.toLocaleDateString().split(`.`)[0];
        const  dayNames = [
            "Niedz",
            "Pon",
            "Wt",
            "Śr",
            "Czw",
            "Pt",
            "Sob"
        ];
        const name = dayNames[this.props.date.getDay()];
        return (
            <>
            <h2>{name}</h2>
            <h3>{day}</h3>
            </>
        )
    };
    render() {
        return (
            <div>{this.formatDate()}</div>
        )
    }
}

class CalendarEventList extends Component {
    render() {
        return (
            <ul>
                <li> lista</li>
            </ul>
        )
    }
}

class AddEvent extends Component {
    state = {
        show: false
    };
    toggle = () => {
        this.setState({show: !this.state.show})
    };
    showForm = (e) => {
        e.preventDefault();
        this.toggle();
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
                    <EventForm users={this.props.users}/>
                </>
            )
        } else {
            return <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
        }
    }
}

class EventForm extends Component {
    state = {
        date: "",
        inPlus: "",
        inMinus: "",
        count: 0
    };
    selectPerson1 = () => {
        return this.props.users.map((el) => {
            return (
                <option key={el}> {el.data().name} {el.data().surname}</option>
            )
        })
    };
    selectPerson2 = () => {
        return this.props.users.map((el) => {
            return (
                <option key={el}> {el.data().name} {el.data().surname}</option>
            )
        })
    };
    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };
    hoursHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };
    submitHandler = (e) => {
        if (this.state.inPlus === this.state.inMinus) {
            e.preventDefault();
            alert("Pola osoby zastępującej i zastępowanej nie mogą mieć tej samej wartości")
        }
        if ((this.state.count === "") || (this.state.count <= 0)) {
            e.preventDefault();
            alert("Pole godzin nie może być puste ani mniejsze od 0!")
        } else {
            e.preventDefault();
            db.collection(`sub`).add(this.state);
            alert("Dodano nowe zastępstwo!")
        }
    };

    render() {
        return (
            <>
                <Picker/>
                <form action="">
                    <label>Zastępowany
                        <select name="inMinus" id="" onChange={this.inputHandler}>{this.selectPerson1()}</select>
                    </label>
                    <input name="count" id="" onChange={this.hoursHandler}>
                    </input>
                    <label>Zastępujący
                        <select name="inPlus" id="" onChange={this.inputHandler}>{this.selectPerson2()}</select>
                    </label>
                    <button onClick={this.submitHandler}>Zatwierdź</button>
                </form>
                <SubstituteList/>
            </>
        )
    }
}

// class EventList extends Component {
//     renderEvents = () => {
//         return this.props.map((el) => {
//             return <li>{el.data()}</li>
//         })
//     };
//
//     render() {
//         return (
//             <>
//                 <h1>Data</h1>
//                     {/*{this.props.data().date}*/}
//                 <ul>
//                     {this.renderEvents()}
//                 </ul>
//             </>
//         )
//     }
// }

class Users extends Component {
    render() {
        return (
            <div className={"user__chessboard"}>
                <AddUser/>
                <UserList/>
            </div>
        )
    }
}

class AddUser extends Component {
    state = {
        show: false
    };
    toggle = () => {
        this.setState({show: !this.state.show})
    };
    showForm = (e) => {
        e.preventDefault();
        this.toggle();
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
                    <AddUserForm/>
                </>
            )
        } else {
            return <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
        }
    }
}

class AddUserForm extends Component {
    state = {
        userId: "",
        name: "",
        surname: "",
        dailyTime: 0,
        totalTime: 0,
        inPlus: 0,
        inMinus: 0
    };
    updateState = () => {
        this.setState({})
    };

    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    clearForm = () => {
        document.querySelector("name").value = "";
        document.querySelector("surname").value = "";
        document.querySelector("dailyTime").value = "";
    };
    add = (e) => {
        e.preventDefault();
        if ((this.state.name === "") || (this.state.surname === "")) {
            return alert("Pola Imię oraz Nazwisko muszą być uzupełnione!")
        } else {
            e.preventDefault();
            db.collection(`users`).add(this.state);
            alert("Dodano nowego użytkownika!");
            this.clearForm();
        }
    };

    render() {
        return (
            <form className={"user__form"}>
                <label> Imię
                    <input onChange={this.inputHandler} name="name" type="text" id="name"/>
                </label>
                <label> Nazwisko
                    <input onChange={this.inputHandler} name="surname" type="text" id="surname"/>
                </label>
                <label> Wymiar pracy
                    <input onChange={this.inputHandler} name="dailyTime" type="number" id="dailyTime"/>
                </label>
                <button onClick={this.add}>Dodaj</button>
            </form>
        )
    }
}

class UserList extends Component {
    state = {
        users: [],
    };
    // edit = () => {
    //     let id  = e.target.closest("li").getAttribute("data-id");
    //     db.collection(`users`).doc(id).update();
    // };
    delete = (e) => {
        let id = e.target.closest("li").getAttribute("data-id");
        e.target.closest("li").remove();
        db.collection(`users`).doc(id).delete();
    };
    renderUsers = () => {
        return this.state.users.map((el) => {
            return (
                <li key="el" data-id={el.id} className={"user__tile"}>
                    <div className={"user__tile__name"}>{el.data().name}</div>
                    <div className={"user__tile__surname"}>{el.data().surname}</div>
                    <div className={"user__tile__sub"}>
                        {/*<div>*/}
                        {/*    <div className={"user__tile__inPlus"}>{el.data().inPlus}</div>*/}
                        {/*    <span className={"user__tile__spacer"}></span>*/}
                        {/*    <div className={"user__tile__inMinus"}>{el.data().inMinus}</div>*/}
                        {/*</div>*/}
                        <div className={"user__tile__total"}>{el.data().totalTime}</div>
                    </div>
                    <button className={"user__tile__delete"} onClick={this.delete}>Delete</button>
                </li>
            )
        });
    };

    render() {
        return (
            <div className={"user__tile__list"}>
                <ul>
                    {this.renderUsers()}
                </ul>
            </div>
        )
    }

    componentDidMount() {
        const collection = db.collection(`users`).get().then((el) => {
                el.docs.map((doc) => {
                    this.setState({
                        users: this.state.users.concat(doc),
                    });
                })
            }
        );
    }
}

// class User extends Component {
//     render() {
//         return (
//             <li key="el" data-id={el.id} className={"user__tile"}>
//                 <div className={"user__tile__name"}>{el.data().name}</div>
//                 <div className={"user__tile__surname"}>{el.data().surname}</div>
//                 <div className={"user__tile__sub"}>
//                     <div>
//                         <div className={"user__tile__inPlus"}>{el.data().inPlus}</div>
//                         <span className={"user__tile__spacer"}></span>
//                         <div className={"user__tile__inMinus"}>{el.data().inMinus}</div>
//                     </div>
//                     <div className={"user__tile__total"}>{el.data().totalTime}</div>
//                 </div>
//                 <button className={"user__tile__delete"} onClick={this.delete}>Delete</button>
//             </li>
//         )
//     }
// }


// class Picker extends Component {
//     state = {
//         date: new Date(),
//     };
//
//     onChange = date => this.setState({date});
//
//     render() {
//         return (
//             <div>
//                 <DatePicker
//                     onChange={this.onChange}
//                     value={this.state.date}
//                 />
//             </div>
//         );
//     }
// }

class SubstituteList extends Component {
    state = {
        sub: []
    };
    renderSubs = () => {
        return this.state.sub.map((el) => {
                return (
                    <li data-id={el.id}>
                        <div>{el.data().date}</div>
                        <div>Zastępujący {el.data().inPlus}</div>
                        <div>{el.data().count}</div>
                        <div>Zastępowany {el.data().inMinus}</div>
                    </li>
                )
            }
        )
    };

    render() {
        return (
            <div>
                <ul>
                    {this.renderSubs()}
                </ul>
                <AddSubstitute users={this.state.users}/>
            </div>
        )
    }

    componentDidMount() {
        const collection = db.collection(`sub`).get().then((el) => {
                el.docs.map((doc) => {
                    console.log(doc.data());
                    this.setState({
                        sub: this.state.sub.concat(doc),
                    });
                })
            }
        );
    }
}

// class WorkingDays extends Component {
//     state = {
//         workingDays: 0
//     };
//     inputHandler = (e) => {
//         this.setState({[e.target.name]: e.target.value})
//     };
//
//     render() {
//         return (
//             <div>
//                 <div>{this.state.workingDays}</div>
//                 <input type="number" name="workingDays" onChange={this.inputHandler}/>
//                 <button>Zatwierdź</button>
//             </div>
//         );
//     }
// }


ReactDOM.render(<App/>, document.getElementById("app"));