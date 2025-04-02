# API Documentation

## Base URL
```
https://api.excursions-for-mother.com/v1
```

## Authentication
All admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Client Endpoints

### Guide Information

#### Get Guide Profile
```
GET /guide/profile
```
Returns information about the guide including experience, specialization, and personal details.

Response:
```json
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "experience": "string",
  "specialization": ["string"],
  "languages": ["string"],
  "photo": "string"
}
```

### Tours

#### List Available Tours
```
GET /tours
```
Returns a list of all available tours with their details.

Query Parameters:
- `category` (optional): Filter by tour category
- `duration` (optional): Filter by duration range
- `price` (optional): Filter by price range

Response:
```json
{
  "tours": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "duration": "string",
      "price": "number",
      "maxGroupSize": "number",
      "category": "string",
      "images": ["string"]
    }
  ],
  "total": "number",
  "page": "number",
  "perPage": "number"
}
```

#### Get Tour Details
```
GET /tours/{tourId}
```
Returns detailed information about a specific tour.

Response:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "duration": "string",
  "price": "number",
  "maxGroupSize": "number",
  "category": "string",
  "images": ["string"],
  "itinerary": ["string"],
  "included": ["string"],
  "notIncluded": ["string"]
}
```

### Availability

#### Get Available Dates
```
GET /availability
```
Returns available dates for booking.

Query Parameters:
- `tourId` (required): ID of the tour
- `month` (optional): Specific month to check
- `year` (optional): Specific year to check

Response:
```json
{
  "availableDates": [
    {
      "date": "string",
      "timeSlots": ["string"],
      "spotsLeft": "number"
    }
  ]
}
```

### Bookings

#### Create Booking
```
POST /bookings
```
Creates a new booking for a tour.

Request Body:
```json
{
  "tourId": "string",
  "date": "string",
  "timeSlot": "string",
  "numberOfPeople": "number",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "specialRequests": "string"
}
```

Response:
```json
{
  "bookingId": "string",
  "status": "string",
  "confirmationCode": "string",
  "bookingDate": "string"
}
```

#### Get Booking Confirmation
```
GET /bookings/{bookingId}
```
Returns booking confirmation details.

Response:
```json
{
  "bookingId": "string",
  "status": "string",
  "confirmationCode": "string",
  "bookingDate": "string",
  "tourDetails": {
    "title": "string",
    "date": "string",
    "timeSlot": "string",
    "numberOfPeople": "number"
  },
  "customerDetails": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### Reviews

#### List Reviews
```
GET /reviews
```
Returns reviews for tours.

Query Parameters:
- `tourId` (optional): Filter reviews by tour
- `page` (optional): Page number for pagination
- `perPage` (optional): Number of reviews per page

Response:
```json
{
  "reviews": [
    {
      "id": "string",
      "tourId": "string",
      "rating": "number",
      "comment": "string",
      "authorName": "string",
      "date": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "perPage": "number"
}
```

#### Create Review
```
POST /reviews
```
Creates a new review for a tour.

Request Body:
```json
{
  "tourId": "string",
  "bookingId": "string",
  "rating": "number",
  "comment": "string"
}
```

### Contact

#### Send Contact Message
```
POST /contact
```
Sends a contact message to the guide.

Request Body:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

## Admin Endpoints

### Authentication

#### Admin Login
```
POST /admin/login
```
Authenticates admin user.

Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "expiresIn": "number"
}
```

### Calendar Management

#### Update Availability
```
PUT /admin/availability
```
Updates guide's availability calendar.

Request Body:
```json
{
  "dates": [
    {
      "date": "string",
      "timeSlots": ["string"],
      "isAvailable": "boolean"
    }
  ]
}
```

### Booking Management

#### List All Bookings
```
GET /admin/bookings
```
Returns all bookings with filtering options.

Query Parameters:
- `status` (optional): Filter by booking status
- `date` (optional): Filter by booking date
- `tourId` (optional): Filter by tour

Response:
```json
{
  "bookings": [
    {
      "bookingId": "string",
      "status": "string",
      "tourDetails": {
        "title": "string",
        "date": "string",
        "timeSlot": "string",
        "numberOfPeople": "number"
      },
      "customerDetails": {
        "name": "string",
        "email": "string",
        "phone": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "perPage": "number"
}
```

#### Update Booking Status
```
PUT /admin/bookings/{bookingId}/status
```
Updates the status of a booking.

Request Body:
```json
{
  "status": "string",
  "notes": "string"
}
```

### Tour Management

#### Create Tour
```
POST /admin/tours
```
Creates a new tour.

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "duration": "string",
  "price": "number",
  "maxGroupSize": "number",
  "category": "string",
  "images": ["string"],
  "itinerary": ["string"],
  "included": ["string"],
  "notIncluded": ["string"]
}
```

#### Update Tour
```
PUT /admin/tours/{tourId}
```
Updates an existing tour.

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "duration": "string",
  "price": "number",
  "maxGroupSize": "number",
  "category": "string",
  "images": ["string"],
  "itinerary": ["string"],
  "included": ["string"],
  "notIncluded": ["string"]
}
```

### Review Management

#### List All Reviews
```
GET /admin/reviews
```
Returns all reviews with filtering options.

Query Parameters:
- `status` (optional): Filter by review status
- `tourId` (optional): Filter by tour
- `rating` (optional): Filter by rating

Response:
```json
{
  "reviews": [
    {
      "id": "string",
      "tourId": "string",
      "rating": "number",
      "comment": "string",
      "authorName": "string",
      "date": "string",
      "status": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "perPage": "number"
}
```

#### Update Review Status
```
PUT /admin/reviews/{reviewId}/status
```
Updates the status of a review.

Request Body:
```json
{
  "status": "string",
  "response": "string"
}
```

### Analytics

#### Get Website Statistics
```
GET /admin/analytics
```
Returns website statistics.

Query Parameters:
- `startDate` (optional): Start date for statistics
- `endDate` (optional): End date for statistics

Response:
```json
{
  "visitors": {
    "total": "number",
    "unique": "number",
    "bySource": {
      "direct": "number",
      "referral": "number",
      "social": "number"
    }
  },
  "bookings": {
    "total": "number",
    "completed": "number",
    "cancelled": "number",
    "revenue": "number"
  },
  "tours": {
    "mostPopular": [
      {
        "tourId": "string",
        "title": "string",
        "bookings": "number"
      }
    ]
  }
}
```

## Clean Endpoints List

### Client Endpoints

#### Guide Information
- GET /guide/profile

#### Tours
- GET /tours
- GET /tours/{tourId}

#### Availability
- GET /availability

#### Bookings
- POST /bookings
- GET /bookings/{bookingId}

#### Reviews
- GET /reviews
- POST /reviews

#### Contact
- POST /contact

### Admin Endpoints

#### Authentication
- POST /admin/login

#### Calendar Management
- PUT /admin/availability

#### Booking Management
- GET /admin/bookings
- PUT /admin/bookings/{bookingId}/status

#### Tour Management
- POST /admin/tours
- PUT /admin/tours/{tourId}

#### Review Management
- GET /admin/reviews
- PUT /admin/reviews/{reviewId}/status

#### Analytics
- GET /admin/analytics 