package com.example.sweat_notes.model;

import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class userEntity {

    @Id
    @Column(nullable = false,updatable = false)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String mail;
    
 
    private String password;

    @Column(nullable = false)
    private String username;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL ,orphanRemoval = true)
    private userStatsEntity stats;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public userStatsEntity getStats() {
        return stats;
    }

    public void setStats(userStatsEntity stats) {
        this.stats = stats;
        if(stats != null){
            stats.setUser(this);
        }
    }
    
}
