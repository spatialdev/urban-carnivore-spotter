import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const ResizableIconButton = ({classes, ...props}) =>
    <IconButton className={classes.small}
                {...props}/>;

const styles = {
    small: {
        '& svg': {
          fontSize: 24,

        },
        width: 24,
        height: 24,
        padding: 0,
        backgroundColor: '#93C838',
        color: 'white',
    }
};

export default withStyles(styles)(ResizableIconButton);