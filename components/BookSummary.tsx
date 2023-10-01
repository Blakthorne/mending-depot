import useSWR from 'swr'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop';

type SummaryComponent = {
    bookId: string
}

/**
 * 
 * @param {string} book The specified book id
 * @returns HTML summary of the book repairs
 */
export default function BookSummary({ bookId }: SummaryComponent) {

    // Retrieve the table requested by the parent component
    const { data, error } = useSWR<object[], Error>('/api/summary/' + bookId)
    if (error) console.log(error)
    if (!data) {
        return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress />
        </Backdrop>
        )
    }
    
    return (
    <div></div>
    )
}