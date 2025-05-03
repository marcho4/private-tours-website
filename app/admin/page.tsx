"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { ru } from 'date-fns/locale';

interface Tour {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  min_persons: number;
  max_persons: number;
  meeting_place: string;
  is_outdoor: boolean;
  is_for_kids: boolean;
}

interface Review {
  id: string;
  review: string;
  rating: number;
  written_by: string;
  booking_id: string;
}

interface TimeSlot {
  id: string;
  day: string;
  time_from: string;
  time_to: string;
  reserved: boolean;
  excursion_id?: string;
}

interface Booking {
  id: string;
  persons: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  timeslot_id: string;
  excursion_id: string;
  additional_info?: string;
  status: string;
}

export default function AdminCMS() {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const ADMIN_LOGIN = 'admin';
  const ADMIN_PASSWORD = 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Неверный логин или пароль');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="space-y-4 w-full max-w-sm p-6 bg-white rounded-lg shadow"
        >
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Логин</label>
            <Input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin CMS</h1>
      <Tabs defaultValue="tours" className="space-y-4 bg-white rounded-lg shadow p-4">
        <TabsList>
          <TabsTrigger value="tours">Туры</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          <TabsTrigger value="timeslots">Таймслоты</TabsTrigger>
          <TabsTrigger value="bookings">Резервации</TabsTrigger>
        </TabsList>

        <TabsContent value="tours" className="space-y-4">
          <ToursSection />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ReviewsSection />
        </TabsContent>

        <TabsContent value="timeslots" className="space-y-4">
          <TimeslotsSection />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToursSection() {
  const queryClient = useQueryClient();
  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ['tours'],
    queryFn: () =>
      fetch('/api/tours')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });
  const deleteTour = useMutation({
    mutationFn: (id: string) => fetch(`/api/tours/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Туры</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Новый тур</DialogTitle>
              <DialogDescription>Заполните данные тура</DialogDescription>
            </DialogHeader>
            <TourForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tours'] })} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Краткое описание</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.name}</TableCell>
                <TableCell>{tour.short_description}</TableCell>
                <TableCell>{tour.price} руб.</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTour.mutate(tour.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ReviewsSection() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () =>
      fetch('/api/reviews')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });
  const deleteReview = useMutation({
    mutationFn: (id: string) => fetch(`/api/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Отзывы</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый отзыв</DialogTitle>
              <DialogDescription>Заполните данные</DialogDescription>
            </DialogHeader>
            <ReviewForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['reviews'] })} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Автор</TableHead>
              <TableHead>Отзыв</TableHead>
              <TableHead>Рейтинг</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.written_by}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>{review.rating} / 5</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteReview.mutate(review.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function TimeslotsSection() {
  const queryClient = useQueryClient();
  const { data: slots = [], isLoading } = useQuery<TimeSlot[]>({
    queryKey: ['timeslots'],
    queryFn: () =>
      fetch('/api/timeslots')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });
  const deleteSlot = useMutation({
    mutationFn: (id: string) => fetch(`/api/timeslots/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timeslots'] }),
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'd MMMM yyyy', { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // "HH:MM:SS" -> "HH:MM"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Таймслоты</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новые таймслоты</DialogTitle>
              <DialogDescription>
                Заполните диапазон дат и времени
              </DialogDescription>
            </DialogHeader>
            <TimeslotForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['timeslots'] })} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Время начала</TableHead>
              <TableHead>Время окончания</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{formatDate(slot.day)}</TableCell>
                <TableCell>{formatTime(slot.time_from)}</TableCell>
                <TableCell>{formatTime(slot.time_to)}</TableCell>
                <TableCell>
                  {slot.reserved ? (
                    <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      Забронирован
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Свободен
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSlot.mutate(slot.id)}
                    disabled={slot.reserved}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function BookingsSection() {
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () =>
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });
  const deleteBooking = useMutation({
    mutationFn: (id: string) => fetch(`/api/bookings/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Резервации</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая резервация</DialogTitle>
              <DialogDescription>Заполните данные резервации</DialogDescription>
            </DialogHeader>
            <BookingForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Фамилия</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Кол-во человек</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.surname}</TableCell>
                <TableCell>{booking.phone_number}</TableCell>
                <TableCell>{booking.persons}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBooking.mutate(booking.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function TourForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    duration: 60, // минуты
    min_persons: 1,
    max_persons: 10,
    meeting_place: '',
    is_outdoor: false,
    is_for_kids: false,
    password: 'admin' // Пароль для API
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось создать тур'}`);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Цена (руб.)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="short_description">Краткое описание</Label>
        <Textarea
          id="short_description"
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Полное описание</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="min-h-32"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_persons">Минимум человек</Label>
          <Input
            id="min_persons"
            name="min_persons"
            type="number"
            value={formData.min_persons}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_persons">Максимум человек</Label>
          <Input
            id="max_persons"
            name="max_persons"
            type="number"
            value={formData.max_persons}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="meeting_place">Место встречи</Label>
        <Input
          id="meeting_place"
          name="meeting_place"
          value={formData.meeting_place}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Длительность (мин.)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="flex space-x-8">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_outdoor"
            checked={formData.is_outdoor}
            onCheckedChange={handleSwitchChange("is_outdoor")}
          />
          <Label htmlFor="is_outdoor">На открытом воздухе</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_for_kids"
            checked={formData.is_for_kids}
            onCheckedChange={handleSwitchChange("is_for_kids")}
          />
          <Label htmlFor="is_for_kids">Для детей</Label>
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Создать</Button>
      </DialogFooter>
    </form>
  );
}

function ReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    review: '',
    rating: 5,
    written_by: '',
    booking_id: '',
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () =>
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось создать отзыв'}`);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="written_by">Имя автора</Label>
        <Input
          id="written_by"
          name="written_by"
          value={formData.written_by}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="review">Текст отзыва</Label>
        <Textarea
          id="review"
          name="review"
          value={formData.review}
          onChange={handleChange}
          required
          className="min-h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating">Оценка (1-5)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="booking_id">ID бронирования</Label>
        <select
          id="booking_id"
          name="booking_id"
          value={formData.booking_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Выберите бронирование</option>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {booking.name} {booking.surname} - {booking.phone_number}
            </option>
          ))}
        </select>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Создать</Button>
      </DialogFooter>
    </form>
  );
}

function TimeslotForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    date_from: '',
    date_to: '',
    time_from: '10:00',
    time_to: '11:00'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/timeslots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось создать таймслоты'}`);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_from">Дата начала</Label>
          <Input
            id="date_from"
            name="date_from"
            type="date"
            value={formData.date_from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_to">Дата окончания</Label>
          <Input
            id="date_to"
            name="date_to"
            type="date"
            value={formData.date_to}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time_from">Время начала</Label>
          <Input
            id="time_from"
            name="time_from"
            type="time"
            value={formData.time_from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time_to">Время окончания</Label>
          <Input
            id="time_to"
            name="time_to"
            type="time"
            value={formData.time_to}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Создать</Button>
      </DialogFooter>
    </form>
  );
}

function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    persons: 1,
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    timeslot_id: '',
    excursion_id: '',
    additional_info: ''
  });

  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ['tours'],
    queryFn: () =>
      fetch('/api/tours')
        .then((res) => res.json())
        .then((json) => json.data || []),
  });

  const { data: timeslots = [] } = useQuery<TimeSlot[]>({
    queryKey: ['timeslots'],
    queryFn: () =>
      fetch('/api/timeslots')
        .then((res) => res.json())
        .then((json) => json.data || [])
        .then(slots => slots.filter((slot: TimeSlot) => !slot.reserved)),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось создать бронирование'}`);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных');
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'd MMMM yyyy', { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // "HH:MM:SS" -> "HH:MM"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Фамилия</Label>
          <Input
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Телефон</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excursion_id">Выберите тур</Label>
        <select
          id="excursion_id"
          name="excursion_id"
          value={formData.excursion_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Выберите тур</option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.name} - {tour.price} руб.
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timeslot_id">Выберите время</Label>
        <select
          id="timeslot_id"
          name="timeslot_id"
          value={formData.timeslot_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Выберите время</option>
          {timeslots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {formatDate(slot.day)} {formatTime(slot.time_from)}-{formatTime(slot.time_to)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="persons">Количество человек</Label>
        <Input
          id="persons"
          name="persons"
          type="number"
          min="1"
          value={formData.persons}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additional_info">Дополнительная информация</Label>
        <Textarea
          id="additional_info"
          name="additional_info"
          value={formData.additional_info}
          onChange={handleChange}
        />
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Создать</Button>
      </DialogFooter>
    </form>
  );
}

