import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Button, Card, CardContent, CardActions } from "@mui/material";
import { format } from "date-fns";
import Header from "../../components/Header/Header";
import Login from "../login/login";
import { useSelector } from "react-redux";
import { selectAuthRoles } from "../../features/authSlice";
import Swal from "sweetalert2";

const Bookings = () => {
  const { userId } = useParams();
  const roles = useSelector(selectAuthRoles);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = roles.includes("talent_artist")
          ? await fetch(`${apiurl}/user/artist/booking-requests/${userId}`)
          : await fetch(`${apiurl}/user/seeker/bookings/${userId}`);
        const data = await response.json();
        setBookingRequests(data.map(request => ({ ...request, isApproved: false, isRejected: false })));
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      }
    };

    fetchBookingRequests();
  }, [userId, roles]);

  const updateBookingStatus = async (index, status) => {
    const action = status === 'approve' ? 'Approve' : 'Reject';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this booking?`,
      showCancelButton: true,
      confirmButtonText: `${action}`,
      cancelButtonText: 'Cancel',
      icon: 'warning'
    });

    if (result.isConfirmed) {
      setBookingRequests(current =>
        current.map((request, idx) => {
          if (idx === index) {
            return { ...request, isApproved: status === 'approve', isRejected: status === 'reject' };
          }
          return request;
        })
      );
      Swal.fire(`${action}ed!`, `The booking has been ${action.toLowerCase()}ed.`, 'success');
    }
  };

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />
      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ padding: 2, width: "80%" }}>
          <Grid container spacing={3}>
            {bookingRequests.length ? (
              bookingRequests.map((request, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={request.bookingId}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <CardContent>
                      <Typography variant="h6">{request.talentSeeker?.name || request.talentArtist?.name}</Typography>
                      <Typography variant="body1" color ="textSecondary" gutterBottom>{request.talentSeeker?.email || request.talentArtist?.email}</Typography>
                      <Typography variant="body2" color="textSecondary">Appointment Time: {format(new Date(request.appointmentTime), "dd MMM yyyy HH:mm")}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>Message: {request.message}</Typography>
                    </CardContent>
                    <CardActions>
                      {!request.isApproved && !request.isRejected && (
                        <>
                          <Button onClick={() => updateBookingStatus(index, 'approve')} variant="contained" color="primary" fullWidth>
                            Approve
                          </Button>
                          <Button onClick={() => updateBookingStatus(index, 'reject')} variant="outlined" color="error" fullWidth>
                            Reject
                          </Button>
                        </>
                      )}
                      {request.isApproved && (
                        <Typography variant="h6" color="green" sx={{ width: '100%', textAlign: 'center' }}>
                          Approved
                        </Typography>
                      )}
                      {request.isRejected && (
                        <Typography variant="h6" color="red" sx={{ width: '100%', textAlign: 'center' }}>
                          Rejected
                        </Typography>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <div style={{ position: "absolute", top: "50%", left: "45%" }}>
                No Booking Requests
              </div>
            )}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Bookings;
