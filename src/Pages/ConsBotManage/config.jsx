import ListGroup from '../../Components/ListGroup';

export const TABEL_META = [
    {
        key: 'intent',
        title: 'Intent (Maksud Kategori)',
    },
    {
        key: 'utterances',
        title: 'Utterances (Ucapan)',
        Cell: (val) => ( <ListGroup data={val} />)
    },
    {
        key: 'answers',
        title: 'Answers (Jawaban)',
        Cell: (val) => ( <ListGroup data={val} />)
    },
];
