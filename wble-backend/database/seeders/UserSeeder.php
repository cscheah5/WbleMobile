<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultProfilePic = '/images/default.jpg';

        User::create([
            'username' => 'user1',
            'password' => '123456',
            'name' => 'User One',
            'email' => 'user1@example.com',
            'role' => 'student',
            'profile_picture' => $defaultProfilePic,
        ]);
        User::create([
            'username' => 'user2',
            'password' => '123456',
            'name' => 'User Two',
            'email' => 'user2@example.com',
            'role' => 'student',
            'profile_picture' => $defaultProfilePic,
        ]);
        User::create([
            'username' => 'leemj',
            'password' => '123456',
            'name' => 'Lee Ming Jie',
            'email' => 'leemj@utar.edu.my',
            'role' => 'lecturer',
            'profile_picture' => $defaultProfilePic,
        ]);
        User::create([
            'username' => 'admin',
            'password' => '123456',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'profile_picture' => $defaultProfilePic,
        ]);
        User::factory()->count(5)->create([
            'role' => 'lecturer',
        ]);
    }
}
