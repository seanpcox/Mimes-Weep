import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Set the table header colors
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: "white"
    }
}));

export const StyledTableRow = styled(TableRow)(() => ({
    // Alternate background color between rows
    '&:nth-of-type(even)': {
        backgroundColor: "#e9e9e9"
    },
    // No border for last row
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

export const HighlightedTableRow = styled(TableRow)(() => ({
    backgroundColor: orange[100]
}));

export const noNewLines = {
    whiteSpace: 'pre'
};

export const tableSize = "small";

export const timeColumnDataAlign = "right";

export const positionColumnDataAlign = "center";

export const trophyIcon = <EmojiEventsTwoToneIcon fontSize="small" sx={{ color: "#c9b037" }} />;

export const silverMedal = <MilitaryTechTwoToneIcon fontSize="small" sx={{ color: "#78909c" }} />;

export const bronzeMedal = <MilitaryTechTwoToneIcon fontSize="small" sx={{ color: "#ad8a56" }} />;