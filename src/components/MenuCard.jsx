import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";

const MenuCard = ({ item, onAddToOrder }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 2, width: "100%",  borderRadius: 4, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s ease" }}>
      {item.image && (
        <CardMedia
          component="img"
          height="140"
          image={item.image}
          alt={item.name}
          sx={{
            objectFit: "cover",
            borderRadius: "4px 4px 0 0", // Smooth corners for image
          }}
        />
      )}
      <CardContent sx={{ paddingBottom: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {item.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
        ₹{item.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={onAddToOrder}
          sx={{
            backgroundColor: "#FF9800",
            "&:hover": {
              backgroundColor: "#FB8C00",
            },
            borderRadius: 25,
            textTransform: "none",
            transition: "background-color 0.3s ease",
          }}
        >
          Add to Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default MenuCard;
