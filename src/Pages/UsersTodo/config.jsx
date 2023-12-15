
export const TABEL_META = [
    {
        key: 'no',
        title: 'No',
    },
    {
        key: 'title',
        title: 'Title',
    },
    {
        key: 'task',
        title: 'Task',
    },
    {
        key: 'progress',
        title: 'Progress',
        Cell: (val) => (<>{val} %</>)
    },
    {
        key: 'user',
        title: 'user',
        Cell: (val) => (<>{val} %</>)
    },
    {
        key: 'statusFinsih',
        title: 'Status Todo',
        Cell: (val) => (<>{val} %</>)
    },
    {
        key: 'createdAt',
        title: 'Created At',
        Cell: (val) => (<>{val} %</>)
    },
    {
        key: 'updatedAt',
        title: 'Updated At',
        Cell: (val) => (<>{val} %</>)
    },
];
