import Chat from "./Components/Chats";
import Gallery from "./Components/Gallery";
import Todo from "./Components/Todo";

export const TABS_LIST = {
    titleHeader: [
        {
            id: 1,
            title: 'Chat',
            tabKey: 'chat',
            icon: 'far fa-comments',
            active: true,
        },
        {
            id: 2,
            title: 'List Todo',
            tabKey: 'list-todo',
            icon: 'fa fa-tasks',
        },
        {
            id: 3,
            title: 'Gallery',
            tabKey: 'gallery',
            icon: 'far fa-image',
        },
    ],
    contentBody: [
        {
            id: 1,
            tabKey: 'chat',
            children: <Chat />,
            active: true,
        },
        {
            id: 2,
            tabKey: 'list-todo',
            children: <Todo />,
        },
        {
            id: 3,
            tabKey: 'gallery',
            children: <Gallery />,
        },
    ],
}