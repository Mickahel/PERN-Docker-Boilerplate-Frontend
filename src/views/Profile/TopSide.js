import React, { useState, useContext } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import { UserContext } from "contexts/Providers/UserProvider";
import Typography from '@material-ui/core/Typography';
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Trans } from "react-i18next";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";

const useStyles = makeStyles(theme => ({
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    input: {
        display: 'none'
    },
}));


function TopSide(props) {
    const classes = useStyles();
    const userContext = useContext(UserContext);
    const themeContext = useContext(ThemeContext);
    const { fetch } = useFetch()

    const changeTheme = async () => {
        themeContext.toggleMuiType()
        try {
            await fetch({
                url: Endpoints.user.editProfile,
                data: {
                    theme: themeContext.muiType =="light" ?"dark": "light",
                    //theme: "dark"
                },
                method: "PUT",
            })

        } catch (e) {
        }
        
    }
    return (
        <div className="topSide flex justify-between">
            <div className="flex">
                <div>
                    <Avatar className={classes.large} src={process.env.REACT_APP_API_PUBLIC_URL+ userContext.user.profileImageUrl}></Avatar>
                </div>
                <div className="flex flex-col justify-center ml-3">
                    <Typography variant="h6" gutterBottom>
                        {`${userContext.user.firstname} ${userContext.user.lastname}`}
                        
                    </Typography>
                    <Typography color="primary" variant="body1" gutterBottom>
                        {userContext.user.email}
                    </Typography>
                </div>
            </div>
            <div className="mt-5">
                <FormControlLabel
                    control={<Switch color="primary" checked={themeContext.muiType == "dark"} onChange={changeTheme} />}
                    label={<Trans>theme.{themeContext.muiType}Theme</Trans>}
                />
            </div>

        </div>)
}

export default TopSide