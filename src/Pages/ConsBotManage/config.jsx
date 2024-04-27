import ListGroup from '../../Components/ListGroup';

export const TABEL_META = [
    {
        key: 'intent',
        title: 'Intent (Maksud Kategori)',
        Cell: (val) => (<b>{val}</b>)
    },
    {
        key: 'utterances',
        title: 'Utterances (Ucapan)',
        Cell: (val) => (
            <div
                style={
                    {
                        overflow: 'scroll',
                        maxHeight: '150px',
                    }
                }
            >
                <ListGroup data={val} />
            </div>
        )
    },
    {
        key: 'answers',
        title: 'Answers (Jawaban)',
        Cell: (val) => (
            <div
                style={
                    {
                        overflow: 'scroll',
                        maxHeight: '150px',
                    }
                }
            >
                <ListGroup data={val} />
            </div>
        )
    },
];
