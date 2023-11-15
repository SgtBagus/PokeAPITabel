import React, { Component } from 'react';
import update from "immutability-helper";
import { NotificationManager } from 'react-notifications';

import Chat from './components/chat';
import UserProfile from '../../components/UserProfile';
import UserChats from './components/userChats';

import { OnSnapshotGetSingleUser, OnSnapshotHandel } from '../../Data/Chats/';

import { catchError } from "../../Helper/helper"
import EmptyChat from './components/EmptyChat';
import Loading from '../../components/Loading';

class Chats extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            userList: {
                isLoading: true,
                list: {},
            },
            userDetails: {
                isEmpty: true,
                isLoading: true,
                userProfile: {},
                userChat: {},
            },
        };
    }

    componentDidMount = () => {
        this.setState({
            userList: {
                isLoading: true,
                list: {},
            },
            userDetails: {
                isEmpty: true,
                isLoading: true,
                userProfile: {},
                userChat: {},
            },
        }, () => {
            this.getUserList();
        })
    }

    getUserList = async () => {
        const { userList } = this.state;

        try {
            const data = await OnSnapshotHandel('userChats');
            const newUserList = update(userList, {
                list: { $set: data },
                isLoading: { $set: false },
            });

            this.setState({
                userList: newUserList,
            });
        } catch (err) {
            const newUserList = update(userList, {
                isLoading: { $set: false },
                list: { $set: {} },
            });

            this.setState({
                userList: newUserList,
            });

            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }

    getDetailUser = async (chatId, uid) => {
        const { userDetails } = this.state;

        const newData = update(userDetails, {
            userProfile: { $set: {} },
            isEmpty: { $set: false },
            isLoading: { $set: true },
        });

        this.setState({
            userDetails: newData,
        }, () => {
            this.findUser(uid);
        });
    }

    findUser = async (uid) => {
        const { userDetails } = this.state;

        try {
            const data = await OnSnapshotGetSingleUser('users', uid);
            const newData = update(userDetails, {
                userProfile: { $set: data },
                isEmpty: { $set: false },
                isLoading: { $set: false },
            });

            this.setState({
                userDetails: newData,
            });
        } catch (err) {
            const newData = update(userDetails, {
                userProfile: { $set: {} },
                isEmpty: { $set: true },
                isLoading: { $set: false },
            });

            this.setState({
                userDetails: newData,
            });

            NotificationManager.error(catchError(err), 'Terjadi Kesalahan', 5000);
        }
    }
    
    render() {
        const {
            userList: {
                isLoading, list,
            },
            userDetails: {
                isEmpty, isLoading: isLoadingUserDetails, userProfile,
            },
        } = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <h4 className="mt-4 mb-2">User List</h4>
                    <div className="row">
                        <div className="col-4">
                            <UserChats
                                titleChat="List Pengguna"
                                isLoading={isLoading}
                                data={list}
                                userClickHandel={this.getDetailUser}
                            />
                        </div>
                        <div className="col-8">
                            {
                                isEmpty
                                ? (
                                    <EmptyChat />
                                )
                                : (
                                    <>
                                        {
                                            isLoadingUserDetails
                                            ? (
                                                <div className="container h-100">
                                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                                        <Loading title="Memuat..." />
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <>
                                                    <UserProfile
                                                        isEmpty={isEmpty}
                                                        data={userProfile}
                                                        userName="Hayase Yuuka"
                                                        userRole="Pengguna"
                                                        userDesc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida, ante nec consectetur tempus, nisi dui dapibus eros, tempus laoreet quam tellus in justo."
                                                        userImage="https://images2.alphacoders.com/130/1301500.jpg"
                                                        chatLength="100"
                                                        fileLength="2"
                                                    />
                                                    <Chat
                                                        titleChat="Direct Chats"
                                                    />
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chats;
