import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const ResizableIconButton = ({classes, ...props}) => {
    const {backgroundColor, color} = props;
    return <IconButton className={classes.small}
                style={{backgroundColor, color}}
                {...props}/>;
};

const styles = {
    small: {
        '& svg': {
          fontSize: 24,
        },
        width: 24,
        height: 24,
        padding: 0,
    }
};

export default withStyles(styles)(ResizableIconButton);
